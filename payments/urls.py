from . import api
from django.urls import re_path


urlpatterns = [
    re_path(r"initiate_payments/$", api.InitiatePayments.as_view()),
    re_path('payment_handler/', api.razor_pay_callback, name='payment_handler'),
]
