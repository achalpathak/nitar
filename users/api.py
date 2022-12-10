import json
from django.contrib.auth import login
from rest_framework import status
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


GOOGLE_DTO = settings.GOOGLE_DTO


google_client = WebApplicationClient(GOOGLE_DTO.get("client_id"))


class RegisterUser(APIView):
    serializer_class = user_serializers.RegisterUserSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
        return Response({"message": "User is registered."})


class SendOTP(APIView):
    serializer_class = user_serializers.PhoneOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
        return Response({"message": f"OTP is sent. Valid for next 15minutes."})


class VerifyOTP(APIView):
    serializer_class = user_serializers.VerifyOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            user_obj = serialized_data.save()
            login(
                request, user_obj, backend="django.contrib.auth.backends.ModelBackend"
            )
            return Response(
                {
                    "result": {
                        "full_name": user_obj.full_name,
                        "email": user_obj.email,
                        "phone": user_obj.phone,
                        "email": user_obj.email,
                        "has_active_membership": user_obj.has_active_membership,
                    }
                }
            )
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
            redirect_uri=request.build_absolute_uri(reverse("google_callback")),
            scope=["openid", "email", "profile"],
        )
        return redirect(request_uri)


class GoogleCallbackAPI(APIView):
    def get(self, request):
        code = self.request.GET.get("code")
        token_url, headers, body = google_client.prepare_token_request(
            GOOGLE_DTO.get("token_url"),
            redirect_url=request.build_absolute_uri(reverse("google_callback")),
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
        
        return Response({"result": userinfo_response})
