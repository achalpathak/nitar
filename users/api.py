from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers as user_serializers, models as user_models
from django.contrib.auth import login


class RegisterUser(APIView):
    serializer_class = user_serializers.RegisterUserSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
        return Response({"messsage": "User is registered."})


class SendOTP(APIView):
    serializer_class = user_serializers.PhoneOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            serialized_data.save()
        return Response({"messsage": "OTP is sent. Valid for next 15minutes."})


class VerifyOTP(APIView):
    serializer_class = user_serializers.VerifyOtpSerializer

    def post(self, request):
        serialized_data = self.serializer_class(data=self.request.data)
        if serialized_data.is_valid(raise_exception=True):
            user_obj = serialized_data.save()
            login(
                request, user_obj, backend="django.contrib.auth.backends.ModelBackend"
            )
        return Response({"messsage": "Phone number is verified and logged in."})