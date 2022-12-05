import json
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
import razorpay
from .models import Order, PaymentStatus
from users.models import Memberships
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
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
            amount = 1
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


@csrf_exempt
def razor_pay_callback(request):
    print("hello")

    def verify_signature(response_data):
        client = razorpay_client
        return client.utility.verify_payment_signature(response_data)

    if "razorpay_signature" in request.POST:
        payment_id = request.POST.get("razorpay_payment_id", "")
        provider_order_id = request.POST.get("razorpay_order_id", "")
        signature_id = request.POST.get("razorpay_signature", "")
        order = Order.objects.get(provider_order_id=provider_order_id)
        order.payment_id = payment_id
        order.signature_id = signature_id
        order.save()
        if not verify_signature(request.POST):
            order.status = PaymentStatus.SUCCESS
            obj = UserMemberships.objects.create(
                user=order.user,
                membership=order.membership,
            )
            order.user_membership = obj
            order.save()

            # return render(request, "callback.html", context={"status": order.status})
            return Response({"result": "Success"})
        else:
            order.status = PaymentStatus.FAILURE
            order.save()
            # return render(request, "callback.html", context={"status": order.status})
            return Response({"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        payment_id = json.loads(request.POST.get("error[metadata]")).get("payment_id")
        provider_order_id = json.loads(request.POST.get("error[metadata]")).get(
            "order_id"
        )
        order = Order.objects.get(provider_order_id=provider_order_id)
        order.payment_id = payment_id
        order.status = PaymentStatus.FAILURE
        order.save()
        return Response({"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST)
