from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as settings_models

class TermsAndConditions(APIView):
    def get(self, request):
        tos = settings_models.Settings.objects.get(field="terms_and_conditions")
        return Response({"message": tos.value})
    
class AboutUs(APIView):
    def get(self, request):
        about_us = settings_models.Settings.objects.get(field="about_us")
        return Response({"message": about_us.value})
    
class PrivacyPolicy(APIView):
    def get(self, request):
        about_us = settings_models.Settings.objects.get(field="privacy_policy")
        return Response({"message": about_us.value})