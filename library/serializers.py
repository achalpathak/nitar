from rest_framework import serializers
from . import models as library_models
from settings.serializers import AgeSerializer, LanguageSerializer


class GenersSerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Geners
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Category
        fields = "__all__"


class HomePageListSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()
    duration = serializers.CharField(required=False)
    director_name = serializers.CharField()
    star_cast = serializers.CharField()
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    rankings = serializers.IntegerField()
    content_type = serializers.CharField()
