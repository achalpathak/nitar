from rest_framework import serializers
from . import models as library_models
from settings.serializers import AgeSerializer, LanguageSerializer
from . import utils


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
    director_name = serializers.CharField(required=False)
    star_cast = serializers.CharField(required=False)
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    rankings = serializers.IntegerField(required=False)
    content_type = serializers.CharField()
    slug = serializers.CharField()


class MovieDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    get_genres = serializers.JSONField()

    def to_representation(self, obj):
        ret = super(serializers.ModelSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        return ret

    class Meta:
        model = library_models.Movies
        exclude = ["genres"]


class SeriesBasicDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    get_genres = serializers.JSONField()

    class Meta:
        model = library_models.Series
        exlcude = ["genres"]


class EpisodesDetailWithoutSeriesSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        ret = super(EpisodesDetailWithoutSeriesSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        return ret

    class Meta:
        model = library_models.Episodes
        fields = "__all__"


class EpisodesDetailSerializer(EpisodesDetailWithoutSeriesSerializer):
    series = SeriesBasicDetailSerializer()

    def to_representation(self, obj):
        ret = super(EpisodesDetailSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        return ret

    class Meta:
        model = library_models.Episodes
        fields = "__all__"


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

    def to_representation(self, obj):
        ret = super(ExtrasDetailSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        return ret

    class Meta:
        model = library_models.Extras
        fields = "__all__"
