import json
import os
from django.contrib.auth import login
from rest_framework import status, exceptions
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as user_models
from . import serializers as user_serializers
from django.contrib.auth import logout
from oauthlib.oauth2 import WebApplicationClient
from django.conf import settings
import requests
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

User = get_user_model()

GOOGLE_DTO = settings.GOOGLE_DTO


google_client = WebApplicationClient(GOOGLE_DTO.get("client_id"))


class RegisterUser(APIView):
    serializer_class = user_serializers.RegisterUserSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        msg = "email"
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            if serialized_data.data["phone_code"] == "+91":
                msg = "phone"
        return Response(
            {
                "message": f"User is registered. OTP is sent on {msg}. Valid for next 15minutes."
            }
        )


class SendOTP(APIView):
    serializer_class = user_serializers.EmailOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        msg = "email"
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            if self.request.data["phone_code"] == "+91":
                msg = "phone"

        return Response({"message": f"OTP is sent on {msg} Valid for next 15minutes."})


class UpdatePhoneAPI(APIView):
    serializer_class = user_serializers.UpdatePhoneSerializer

    def post(self, request):
        serialized_data = self.serializer_class(
            data=self.request.data, context={"request": request}
        )
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            return Response({"message": f"Phone number is updated."})
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class UpdatePasswordAPI(APIView):
    serializer_class = user_serializers.UpdatePasswordSerializer

    def post(self, request):
        serialized_data = self.serializer_class(
            data=self.request.data, context={"request": request}
        )
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            return Response({"message": f"Password has been updated."})
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordSendEmailAPI(APIView):
    serializer_class = user_serializers.ForgotPasswordSendEmailSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            return Response(
                {
                    "message": f"Password reset link send, please check your mailbox. Link is valid for 1hr."
                }
            )
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordVerifyAPI(APIView):
    serializer_class = user_serializers.ForgotPasswordVerifySerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            return Response({"message": f"Password has been updated."})
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTP(APIView):
    serializer_class = user_serializers.VerifyOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            user_obj = serialized_data.save()
            data = {
                "result": {
                    "full_name": user_obj.full_name,
                    "phone": user_obj.phone,
                    "phone_code": user_obj.phone_code,
                    "phone_verified": user_obj.phone_verified,
                    "email_verified": user_obj.email_verified,
                    "email": user_obj.email,
                    "has_active_membership": user_obj.has_active_membership,
                }
            }
            if self.request.data.get("device_type") == "mobile":
                token, created = Token.objects.get_or_create(user=user_obj)
                data["result"]["token"] = token.key
            else:
                login(
                    request,
                    user_obj,
                    backend="django.contrib.auth.backends.ModelBackend",
                )
            return Response(data)
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(APIView):
    serializer_class = user_serializers.LoginSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            user_obj = serialized_data.save()
            data = {
                "result": {
                    "full_name": user_obj.full_name,
                    "phone": user_obj.phone,
                    "phone_code": user_obj.phone_code,
                    "phone_verified": user_obj.phone_verified,
                    "email_verified": user_obj.email_verified,
                    "email": user_obj.email,
                    "has_active_membership": user_obj.has_active_membership,
                }
            }
            if self.request.data.get("device_type") == "mobile":
                token, created = Token.objects.get_or_create(user=user_obj)
                data["result"]["token"] = token.key
            else:
                login(
                    request,
                    user_obj,
                    backend="django.contrib.auth.backends.ModelBackend",
                )
            return Response(data)
        return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)


class ContactUsAPI(APIView):
    serializer_class = user_serializers.ContactUsSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
            return Response({"message": "Thank you for contacting us."})


class PlansAPI(APIView):
    serializer_class = user_serializers.PlansSerializer

    def get(self, request):
        features_obj = list(
            user_models.MembershipFeatures.objects.all().values_list("name", flat=True)
        )
        objs = user_models.Memberships.objects.filter(published=True)
        serialized_data = self.serializer_class(
            objs, context={"request": request}, many=True
        )
        data = {"features": features_obj, "plans": serialized_data.data}
        return Response({"result": data})


class LogoutAPI(APIView):
    def get(self, request):
        logout(request)
        return Response({"result": "User is logged out."})


class GoogleLoginAPI(APIView):
    def get(self, request):
        request_uri = google_client.prepare_request_uri(
            GOOGLE_DTO.get("authorization_url"),
            redirect_uri=os.environ["SERVER_DOMAIN"] + reverse("google_callback"),
            scope=["openid", "email", "profile"],
        )
        return redirect(request_uri)


class UserInfo(APIView):
    def get(self, request):
        user = request.user
        if type(user) == AnonymousUser:
            return Response(
                {"message": f"User is not logged in."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            context = {
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "phone_verified": user.phone_verified,
                "phone_code": user.phone_code,
                "has_active_membership": user.has_active_membership,
            }
            return Response({"result": context})


class GoogleCallbackAPI(APIView):
    def get(self, request):
        code = self.request.GET.get("code")
        token_url, headers, body = google_client.prepare_token_request(
            GOOGLE_DTO.get("token_url"),
            redirect_url=os.environ["SERVER_DOMAIN"] + reverse("google_callback"),
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_DTO.get("client_id"), GOOGLE_DTO.get("client_secret")),
        )
        # Parse the tokens!
        google_client.parse_request_body_response(json.dumps(token_response.json()))

        # Get user info
        uri, headers, body = google_client.add_token(GOOGLE_DTO.get("userinfo_url"))
        userinfo_response = requests.get(uri, headers=headers, data=body).json()
        validated_data = {
            "full_name": userinfo_response["name"],
            "is_active": True,
            "email_verified": True,
        }
        user_obj, _ = User.objects.update_or_create(
            email=userinfo_response["email"], defaults=validated_data
        )
        user_obj.save()
        user_obj.backend = settings.AUTHENTICATION_BACKENDS[0]
        login(
            request,
            user_obj,
            backend="django.contrib.auth.backends.ModelBackend",
        )
        return redirect(request.build_absolute_uri(reverse("home")))
