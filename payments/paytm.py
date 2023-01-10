import os
from django.conf import settings
from django.urls import reverse
from payments.models import Order, PaymentStatus
from users.models import Memberships, UserMemberships

# from .paytm_utils import generateSignature, verifySignature
from paytmchecksum import PaytmChecksum
import requests
import json


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

        dto = {
            "amount": amount,
            "membership_obj": membership_obj,
        }

        order = self.create_order(dto)
        paytmParams = dict()
        paytmParams["body"] = {
            "requestType": "Payment",
            "mid": settings.PAYTM_MERCHANT_ID,
            "websiteName": settings.PAYTM_WEBSITE,
            "orderId": str(order.id),
            "callbackUrl": os.environ["SERVER_DOMAIN"]
            + reverse("paytm_payment_handler"),
            "txnAmount": {
                "value": str(amount),
                "currency": currency,
            },
            "userInfo": {
                "custId": str(self.request.user.email),
            },
        }
        checksum = PaytmChecksum.generateSignature(
            json.dumps(paytmParams["body"]), settings.PAYTM_SECRET_KEY
        )

        paytmParams["head"] = {"signature": checksum}

        order.signature_id = checksum
        order.save()

        post_data = json.dumps(paytmParams)
        headers = {
            "Content-type": "application/json",
            "signature": checksum,
            "version": "v1",
        }

        url = settings.PAYTM_INITIATE_URL % (settings.PAYTM_MERCHANT_ID, str(order.id))
        response = requests.post(url, data=post_data, headers=headers).json()
        final_resp = {
            "mid": settings.PAYTM_MERCHANT_ID,
            "orderId": str(order.id),
            "txnToken": response["body"]["txnToken"],
        }
        return final_resp

    def validate_payment(self):
        paytm_params = {}
        paytm_checksum = self.request.data["CHECKSUMHASH"][0]
        paytm_orderid = self.request.data["ORDERID"][0]
        order = Order.objects.get(id=paytm_orderid, gateway="paytm")
        for key, value in self.request.data.items():
            if key == "CHECKSUMHASH":
                paytm_checksum = value[0]
            else:
                paytm_params[key] = str(value[0])

        # Verify checksum
        is_valid_checksum = verify_checksum(
            paytm_params, settings.PAYTM_SECRET_KEY, str(paytm_checksum)
        )
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
