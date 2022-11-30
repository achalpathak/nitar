from django.contrib.auth import login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as user_models
from . import serializers as user_serializers
from django.contrib.auth import logout


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
            return Response({"result": {
                "full_name": user_obj.user.full_name,
                "email": user_obj.user.email,
                "phone": user_obj.user.phone,
                "email": user_obj.user.email,
                "has_active_membership": user_obj.user.has_active_membership
            }})
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
        serialized_data = self.serializer_class(objs, many=True)
        data = {"features": features_obj, "plans": serialized_data.data}
        return Response({"result": data})
    
class LogoutAPI(APIView):

    def get(self, request):
        logout(request)
        return Response({"result": "User is logged out."})
