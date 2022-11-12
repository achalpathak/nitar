from . import api
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    re_path(r"register/$", csrf_exempt(api.RegisterUser.as_view())),
    re_path(r"send-otp/$", csrf_exempt(api.SendOTP.as_view())),
    re_path(r"verify-otp/$", csrf_exempt(api.VerifyOTP.as_view())),
]
