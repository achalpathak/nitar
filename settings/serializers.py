from rest_framework import serializers
from . import models
from library.utils import format_image_url


class WebsiteConfigSettingsAPI(serializers.Serializer):
    field = serializers.CharField()
    value = serializers.CharField()
    toggle_value = serializers.BooleanField()
    image = serializers.ImageField()
    field_description = serializers.CharField()

    def to_representation(self, obj):
        ret = super(WebsiteConfigSettingsAPI, self).to_representation(obj)
        ret["image"] = format_image_url(ret["image"])
        return ret


class AgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AgeChoices
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LanguageChoices
        fields = "__all__"
