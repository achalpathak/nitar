import os
from django.conf import settings
import razorpay
from django.urls import reverse
from payments.models import Order, PaymentStatus
from users.models import Memberships, UserMemberships

class RazorPayPayments:
    def __init__(self, request):
        self.request = request
        self.razorpay_client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        
    def create_order(self, dto):
        # Save the order in DB
        order = Order.objects.create(
            user=self.request.user,
            amount=dto["amount"],
            membership=dto["membership_obj"],
            membership_plan=dto["membership_obj"].name,
            currency=self.request.user.currency_mode,
            gateway="razor_pay",
            provider_order_id=dto["razorpay_order"]["id"],
        )
        return order
    
    def start_payment(self):
        currency = self.request.user.currency_mode
        membership_obj = Memberships.objects.get(id=self.request.data["membership_id"])
        if currency == "INR":
            amount = membership_obj.price_in_inr
        else:
            amount = membership_obj.price_in_dollar
            
        razorpay_order = self.razorpay_client.order.create(
                    {
                        "amount": int(amount) * 100,
                        "currency": currency,
                        "payment_capture": "0",
                    }
                )
        
        dto={
            "amount": amount,
            "membership_obj": membership_obj,
            "razorpay_order": razorpay_order
        }
        
        self.create_order(dto)
        
        return_resp = {}
        return_resp["razorpay_order_id"] = razorpay_order["id"]
        return_resp["razorpay_merchant_key"] = settings.RAZORPAY_KEY_ID
        return_resp["razorpay_amount"] = amount
        return_resp["currency"] = currency
        return_resp["callback_url"] = os.environ["SERVER_DOMAIN"] + reverse("payment_handler")
        
        return return_resp
    
    def validate_payment(self):
        if "razorpay_signature" in self.request.data:
            payment_id = self.request.data.get("razorpay_payment_id", "")
            provider_order_id = self.request.data.get("razorpay_order_id", "")
            signature_id = self.request.data.get("razorpay_signature", "")
            params_dict = {
                "razorpay_order_id": provider_order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature_id,
            }
            order = Order.objects.get(provider_order_id=provider_order_id)
            order.payment_id = payment_id
            order.signature_id = signature_id
            order.save()
            result = self.razorpay_client.utility.verify_payment_signature(params_dict)
            if result is not None:
                try:
                    # capture the payemt
                    self.razorpay_client.payment.capture(
                        payment_id, int(order.amount) * 100
                    )

                    order.status = PaymentStatus.SUCCESS
                    obj = UserMemberships.objects.create(
                        user=order.user,
                        membership=order.membership,
                    )
                    order.user_membership = obj
                    order.save()
                    return True
                    
                except:
                    # if there is an error while capturing payment.
                    print("[x] Payment capture failed")
                    order.status = PaymentStatus.FAILURE
                    order.save()
                    return False
                    
            else:
                print("[x] Signature verification failed.")
                order.status = PaymentStatus.FAILURE
                order.save()
                return False
        else:
            print("[x] Payment Failed")
            payment_id = self.request.data["metadata"]["payment_id"]
            provider_order_id = self.request.data["metadata"]["order_id"]
            order = Order.objects.get(provider_order_id=provider_order_id)
            order.payment_id = payment_id
            order.status = PaymentStatus.FAILURE
            order.save()
            return False