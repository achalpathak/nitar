from . import api
from django.urls import path, include, re_path


urlpatterns = [
    re_path(r"register/$", api.RegisterUser.as_view()),
    re_path(r"send-otp/$", api.SendOTP.as_view()),
    re_path(r"verify-otp/$", api.VerifyOTP.as_view()),
    re_path(r"contact_us/$", api.ContactUsAPI.as_view()),
    re_path(r"plans/$", api.PlansAPI.as_view()),
    re_path(r"logout/$", api.LogoutAPI.as_view()),
    
]
