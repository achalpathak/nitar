from rest_framework import serializers
from . import models as library_models
from settings.serializers import AgeSerializer, LanguageSerializer


class GenersSerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Geners
        fields = "__all__"


class BannerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Banner
        fields = "__all__"
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Category
        fields = "__all__"


class UpcomingListSerializer(serializers.ModelSerializer):
    genres = GenersSerializer(many=True)
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")

    class Meta:
        model = library_models.Upcoming
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
    slug = serializers.CharField()


class MovieDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    genres = GenersSerializer(many=True)

    class Meta:
        model = library_models.Movies
        fields = "__all__"


class SeriesBasicDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    genres = GenersSerializer(many=True)

    class Meta:
        model = library_models.Series
        fields = "__all__"


class EpisodesDetailWithoutSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Episodes
        fields = "__all__"


class EpisodesDetailSerializer(EpisodesDetailWithoutSeriesSerializer):
    series = SeriesBasicDetailSerializer()


class SeriesDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    genres = GenersSerializer(many=True)
    episodes_set = EpisodesDetailWithoutSeriesSerializer(many=True, read_only=True)

    class Meta:
        model = library_models.Series
        fields = "__all__"


class UpcomingDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    genres = GenersSerializer(many=True)

    class Meta:
        model = library_models.Upcoming
        fields = "__all__"


class ExtrasDetailSerializer(serializers.ModelSerializer):
    language = serializers.ReadOnlyField(source="language.name")
    genres = GenersSerializer(many=True)

    class Meta:
        model = library_models.Extras
        fields = "__all__"
