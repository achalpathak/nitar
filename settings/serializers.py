from rest_framework import serializers
from . import models


class AgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AgeChoices
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LanguageChoices
        fields = "__all__"
