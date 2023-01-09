from . import api
from django.urls import path, include, re_path


urlpatterns = [
    re_path(r"get_user_info/$", api.UserInfo.as_view()),
    re_path(r"register/$", api.RegisterUser.as_view()),
    re_path(r"update_phone/$", api.UpdatePhoneAPI.as_view()),
    # re_path(r"update_password/$", api.UpdatePasswordAPI.as_view()),  # RESET PASSWORD
    # re_path(
    #     r"forgot_password_send_email/$", api.ForgotPasswordSendEmailAPI.as_view()
    # ),  # FORGOT PASSWORD SEND EMAIL
    # re_path(
    #     r"forgot_password_verify/$", api.ForgotPasswordVerifyAPI.as_view()
    # ),  # FORGOT PASSWORD UPDATE
    re_path(r"send-otp/$", api.SendOTP.as_view()),
    re_path(r"verify-otp/$", api.VerifyOTP.as_view()),
    # re_path(r"login/$", api.LoginAPI.as_view()),
    re_path(r"contact_us/$", api.ContactUsAPI.as_view()),
    re_path(r"plans/$", api.PlansAPI.as_view()),
    re_path(r"logout/$", api.LogoutAPI.as_view()),
    re_path(r"login_with_google/$", api.GoogleLoginAPI.as_view()),
    re_path(
        r"google_callback/$", api.GoogleCallbackAPI.as_view(), name="google_callback"
    ),
    re_path(
        r"google_callback_android/$", api.GoogleCallbackAndroidAPI.as_view(), name="google_callback_android"
    ),
]
