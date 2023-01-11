import json
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
import traceback
from django.shortcuts import redirect
from .razorpay import RazorPayPayments
from .paytm import PayTmPayments
from django.conf import settings
import os


class InitiatePayments(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            request_data = request
            membership_id = request.data["membership_id"]
            gateway = request.data["gateway"]
            user = request.user
            print(user)
            if not user.phone:
                return Response(
                    {"message": f"Phone number is not updated."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payment_class_map = {
                "razor_pay": RazorPayPayments(request_data),
                "paytm": PayTmPayments(request_data)
                # "stripe": Stripe(),
            }
            payment_class_obj = payment_class_map[gateway]
            start_payment_resp = payment_class_obj.start_payment()
            return Response({"result": start_payment_resp})

        except KeyError as e:
            return Response(
                {"message": f"{e} field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            traceback.print_exc()
            return Response(
                {"message": "Server Error. Contact Admin."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RazorPayCallback(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request):
        try:
            request_data = request
            razorpay_class = RazorPayPayments(request_data)
            resp = razorpay_class.validate_payment()
            if resp:
                return Response({"result": "Success"})
            else:
                return Response(
                    {"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            # for any error
            traceback.print_exc()
            print("[x] Some other error", str(e))
            return Response({"result": "Failed"}, status=status.HTTP_400_BAD_REQUEST)

class PayTmCallback(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request):
        try:
            request_data = request
            paytm_class = PayTmPayments(request_data)
            resp, msg = paytm_class.validate_payment()
            if(os.environ.get('MODE') == 'LOCAL'):
                return redirect(f"{os.environ.get('SERVER_DOMAIN')}/plans?success={resp}&message={msg}")
            else:
                return redirect(
                    f"{request.build_absolute_uri(reverse('plans'))}?success={resp}&message={msg}"
                )

        except Exception as e:
            # for any error
            traceback.print_exc()
            print("[x] Some other error", str(e))
            resp = False
            return redirect(f"{os.environ.get('SERVER_DOMAIN')}/plans?success={resp}&message={str(e)}")
