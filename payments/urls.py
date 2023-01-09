from . import api
from django.urls import re_path


urlpatterns = [
    re_path(r"initiate_payments/$", api.InitiatePayments.as_view()),
    re_path(
        r"payment_handler/$",
        api.RazorPayCallback.as_view(),
        name="payment_handler",
    ),
    re_path(
        r"paytm_payment_handler/$",
        api.PayTmCallback.as_view(),
        name="paytm_payment_handler",
    ),
]
