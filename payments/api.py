import json
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
import razorpay
from .models import Order, PaymentStatus
from users.models import Memberships
from django.conf import settings
from users.models import UserMemberships

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


class InitiatePayments(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            callback_url = request.build_absolute_uri(reverse("payment_handler"))
            membership_id = request.data["membership_id"]
            user = request.user
            memberhip_obj = Memberships.objects.get(id=membership_id)

            currency = user.currency_mode

            if currency == "INR":
                amount = memberhip_obj.price_in_inr
            else:
                amount = memberhip_obj.price_in_dollar
            amount = 1.99
            razorpay_order = razorpay_client.order.create(
                {
                    "amount": int(amount) * 100,
                    "currency": currency,
                    "payment_capture": "0",
                }
            )

            # Save the order in DB
            order = Order.objects.create(
                user=user,
                amount=amount,
                membership=memberhip_obj,
                membership_plan=memberhip_obj.name,
                currency=currency,
                provider_order_id=razorpay_order["id"],
            )

            razorpay_order_id = razorpay_order["id"]
            context = {}
            context["razorpay_order_id"] = razorpay_order_id
            context["razorpay_merchant_key"] = settings.RAZORPAY_KEY_ID
            context["razorpay_amount"] = amount
            context["currency"] = currency
            context["callback_url"] = callback_url
            return Response({"result": context})
        except KeyError as e:
            return Response(
                {"message": f"{e} field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RazorPayCallback(APIView):
    # permission_classes = ()
    # authentication_classes = ()

    def post(self, request):
        try:
            if "razorpay_signature" in request.data:
                payment_id = request.data.get("razorpay_payment_id", "")
                provider_order_id = request.data.get("razorpay_order_id", "")
                signature_id = request.data.get("razorpay_signature", "")
                print(payment_id, provider_order_id, signature_id)
                params_dict = {
                    "razorpay_order_id": provider_order_id,
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature_id,
                }
                order = Order.objects.get(provider_order_id=provider_order_id)
                order.payment_id = payment_id
                order.signature_id = signature_id
                order.save()
                result = razorpay_client.utility.verify_payment_signature(params_dict)
                if result is not None:
                    try:
                        # capture the payemt
                        razorpay_client.payment.capture(
                            payment_id, int(order.amount) * 100
                        )

                        order.status = PaymentStatus.SUCCESS
                        obj = UserMemberships.objects.create(
                            user=order.user,
                            membership=order.membership,
                        )
                        order.user_membership = obj
                        order.save()

                        # return render(request, "callback.html", context={"status": order.status})
                        return Response({"result": "Success"})
                    except:
                        # if there is an error while capturing payment.
                        print("[x] Payment capture failed")
                        order.status = PaymentStatus.FAILURE
                        order.save()
                        return Response(
                            {"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    print("[x] Signature verification failed.")
                    order.status = PaymentStatus.FAILURE
                    order.save()
                    # return render(request, "callback.html", context={"status": order.status})
                    return Response(
                        {"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                payment_id = json.loads(request.data.get("error[metadata]")).get(
                    "payment_id"
                )
                provider_order_id = json.loads(request.data.get("error[metadata]")).get(
                    "order_id"
                )
                order = Order.objects.get(provider_order_id=provider_order_id)
                order.payment_id = payment_id
                order.status = PaymentStatus.FAILURE
                order.save()
                return Response(
                    {"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST
                )
        except:
            # for any error
            return Response({"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST)
