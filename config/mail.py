import requests
from django.conf import settings

def send_email_otp(to_email, otp):
    url = "https://api.authkey.io/request"

    querystring = {"authkey":settings.EMAIL_AUTH_KEY, "email":to_email, "mid": settings.EMAIL_OTP_TEMPLATE_ID, "otp": otp}

    response = requests.request("GET", url, headers={}, params=querystring)

    print(response.text)
    
def send_email_forgot_password(to_email, reset_link):
    url = "https://api.authkey.io/request"

    querystring = {"authkey":settings.EMAIL_AUTH_KEY, "email":to_email, "mid": settings.EMAIL_FORGOT_PASSWORD_TEMPLATE_ID, "reset_link": reset_link}

    response = requests.request("GET", url, headers={}, params=querystring)

    print(response.text)
    