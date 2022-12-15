from rest_framework import serializers
from . import models

class WebsiteConfigSettingsAPI(serializers.Serializer):
    field = serializers.CharField()
    value = serializers.CharField()
    toggle_value = serializers.BooleanField()
    image = serializers.ImageField(use_url=False)
    field_description = serializers.CharField()
class AgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AgeChoices
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LanguageChoices
        fields = "__all__"
