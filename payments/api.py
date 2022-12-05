from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
import razorpay
from .models import Order
from users.models import Memberships
from django.conf import settings

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


class InitiatePayments(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            callback_url = request.build_absolute_uri(reverse('payment_handler'))
            membership_id = request.data["membership_id"]
            user = request.user
            memberhip_obj = Memberships.objects.get(id=membership_id)

            currency = user.currency_mode

            if currency == "INR":
                amount = memberhip_obj.price_in_inr
            else:
                amount = memberhip_obj.price_in_dollar
            amount=1
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
                membership_plan=memberhip_obj.name,
                currency=currency,
                provider_order_id=razorpay_order["id"],
            )

            razorpay_order_id = razorpay_order["id"]
            callback_url = "payment_handler/"
            context = {}
            context["razorpay_order_id"] = razorpay_order_id
            context["razorpay_merchant_key"] = settings.RAZORPAY_KEY_ID
            context["razorpay_amount"] = amount
            context["currency"] = currency
            context["callback_url"] = callback_url
            return Response({"message": context})
        except KeyError as e:
            return Response(
                {"message": f"{e} field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
