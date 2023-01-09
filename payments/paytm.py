import os
from django.conf import settings
from django.urls import reverse
from payments.models import Order, PaymentStatus
from users.models import Memberships, UserMemberships
from .paytm_utils import generate_checksum, verify_checksum


class PayTmPayments:
    def __init__(self, request):
        self.request = request
        self.merchant_id = settings.PAYTM_MERCHANT_ID
        self.merchant_key = settings.PAYTM_SECRET_KEY

    def create_order(self, dto):
        # Save the order in DB
        order = Order.objects.create(
            user=self.request.user,
            amount=dto["amount"],
            membership=dto["membership_obj"],
            membership_plan=dto["membership_obj"].name,
            currency=self.request.user.currency_mode,
            gateway="paytm",
        )
        return order

    def start_payment(self):
        currency = self.request.user.currency_mode
        membership_obj = Memberships.objects.get(id=self.request.data["membership_id"])
        if currency == "INR":
            amount = membership_obj.price_in_inr
        else:
            amount = membership_obj.price_in_dollar
            
        dto={
            "amount": amount,
            "membership_obj": membership_obj,
        }
        
        order = self.create_order(dto)

        params = (
            ("MID", settings.PAYTM_MERCHANT_ID),
            ("ORDER_ID", str(order.id)),
            ("CUST_ID", str(self.request.user.email)),
            ("TXN_AMOUNT", str(amount)),
            ("CHANNEL_ID", "APP" if self.request.data.get("device_type") == "mobile" else "WEB"),
            ("WEBSITE", settings.PAYTM_WEBSITE),
            # ('EMAIL', request.user.email),
            # ('MOBILE_N0', '9911223388'),
            ("INDUSTRY_TYPE_ID", settings.PAYTM_INDUSTRY_TYPE_ID),
            ("CALLBACK_URL", os.environ["SERVER_DOMAIN"] + reverse("paytm_payment_handler")),
            # ('PAYMENT_MODE_ONLY', 'NO'),
        )

        paytm_params = dict(params)
        checksum = generate_checksum(paytm_params, settings.PAYTM_SECRET_KEY)

        order.signature_id = checksum
        order.save()
        paytm_params["CHECKSUMHASH"] = checksum
        return paytm_params

    def validate_payment(self):
        paytm_params = {}
        paytm_checksum = self.request.data['CHECKSUMHASH'][0]
        order = Order.objects.get(signature_id=paytm_checksum)
        for key, value in self.request.data.items():
            if key == 'CHECKSUMHASH':
                paytm_checksum = value[0]
            else:
                paytm_params[key] = str(value[0])
                
        # Verify checksum
        is_valid_checksum = verify_checksum(paytm_params, settings.PAYTM_SECRET_KEY, str(paytm_checksum))
        if is_valid_checksum:
            order.status = PaymentStatus.SUCCESS
            obj = UserMemberships.objects.create(
                user=order.user,
                membership=order.membership,
            )
            order.user_membership = obj
            order.save()
            return True
        else:
            order.status = PaymentStatus.FAILURE
            order.save()
            return False
