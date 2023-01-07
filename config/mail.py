import requests
from django.conf import settings
import os


def send_phone_otp(to_phone, otp):
    url = "https://api.authkey.io/request"

    querystring = {
        "authkey": settings.SMS_AUTH_KEY,
        "mobile": to_phone,
        "country_code": "+91",
        "sid": settings.SMS_SENDER_ID,
        "otp": otp,
        "company": os.environ.get("SERVER_DOMAIN", ""),
    }

    response = requests.request("GET", url, headers={}, params=querystring)

    print(response.text)


def send_email_otp(to_email, otp):
    url = "https://api.authkey.io/request"

    querystring = {
        "authkey": settings.EMAIL_AUTH_KEY,
        "email": to_email,
        "mid": settings.EMAIL_OTP_TEMPLATE_ID,
        "otp": otp,
    }

    response = requests.request("GET", url, headers={}, params=querystring)

    print(response.text)


def send_email_forgot_password(to_email, reset_link):
    url = "https://api.authkey.io/request"

    querystring = {
        "authkey": settings.EMAIL_AUTH_KEY,
        "email": to_email,
        "mid": settings.EMAIL_FORGOT_PASSWORD_TEMPLATE_ID,
        "reset_link": reset_link,
    }

    response = requests.request("GET", url, headers={}, params=querystring)

    print(response.text)
