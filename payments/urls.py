from . import api
from django.urls import re_path


urlpatterns = [
    re_path(r"initiate_payments/$", api.InitiatePayments.as_view()),
]
