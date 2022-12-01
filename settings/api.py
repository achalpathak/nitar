from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as settings_models
from django.db.models import Q
from . import serializers


class WebsiteConfigSettingsAPI(APIView):
    serializer = serializers.WebsiteConfigSettingsAPI

    def get(self, request):
        fields = [
            "name_of_the_app",
            "color_primary",
            "color_secondary",
            "color_alternate",
            "logo_url",
            "qr_code_image_url",
            "app_banner_image",
            "favicon_url",
            "play_store_link",
            "apple_store_link",
            'pay_description',
            'facebook',
            'twitter',
            'youtube',
            'instagram',
            "email",
            "phone",
        ]
        q_objects = Q()
        for t in fields:
            q_objects |= Q(field=t)
        qs_obj = settings_models.Settings.objects.filter(q_objects)
        dto = self.serializer(qs_obj, many=True).data
        return Response({"result": dto})


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
        privacy_obj = settings_models.Settings.objects.get(field="privacy_policy")
        return Response({"message": privacy_obj.value})


class RefundPolicy(APIView):
    def get(self, request):
        refund_obj = settings_models.Settings.objects.get(field="refund_policy")
        return Response({"message": refund_obj.value})
