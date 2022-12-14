from rest_framework import serializers
from . import models as library_models
from settings.serializers import AgeSerializer, LanguageSerializer
from . import utils
from django.conf import settings


class GenersSerializer(serializers.ModelSerializer):
    class Meta:
        model = library_models.Geners
        fields = "__all__"


class BannerInfoSerializer(serializers.ModelSerializer):
    website_banner = serializers.ImageField()
    mobile_banner = serializers.ImageField()

    def to_representation(self, obj):
        ret = super(BannerInfoSerializer, self).to_representation(obj)
        ret["website_banner"] = utils.format_image_url(ret["website_banner"])
        ret["mobile_banner"] = utils.format_image_url(ret["mobile_banner"])
        return ret

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
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()

    def to_representation(self, obj):
        ret = super(UpcomingListSerializer, self).to_representation(obj)
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

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

    def to_representation(self, obj):
        ret = super(HomePageListSerializer, self).to_representation(obj)
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret


class SearchSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()
    poster_small_vertical_image = serializers.ImageField()
    content_type = serializers.CharField()
    slug = serializers.CharField()

    def to_representation(self, obj):
        ret = super(SearchSerializer, self).to_representation(obj)
        print(ret["poster_small_vertical_image"])
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        return ret


class MovieDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()

    genres = GenersSerializer(many=True)

    def to_representation(self, obj):
        ret = super(serializers.ModelSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Movies
        fields = "__all__"


class SeriesBasicDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)

    def to_representation(self, obj):
        ret = super(serializers.ModelSerializer, self).to_representation(obj)
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Series
        fields = "__all__"


class EpisodesDetailWithoutSeriesSerializer(serializers.ModelSerializer):
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()

    def to_representation(self, obj):
        ret = super(
            EpisodesDetailWithoutSeriesSerializer, self
        ).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Episodes
        fields = "__all__"


class EpisodesDetailSerializer(EpisodesDetailWithoutSeriesSerializer):
    series = SeriesBasicDetailSerializer()
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()

    def to_representation(self, obj):
        ret = super(EpisodesDetailSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Episodes
        fields = "__all__"


class SeriesDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)
    episodes_set = EpisodesDetailWithoutSeriesSerializer(many=True, read_only=True)

    def to_representation(self, obj):
        ret = super(serializers.ModelSerializer, self).to_representation(obj)
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Series
        fields = "__all__"


class UpcomingDetailSerializer(serializers.ModelSerializer):
    age_rating = serializers.ReadOnlyField(source="age_rating.name")
    language = serializers.ReadOnlyField(source="language.name")
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)

    def to_representation(self, obj):
        ret = super(serializers.UpcomingDetailSerializer, self).to_representation(obj)
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Upcoming
        fields = "__all__"


class ExtrasDetailSerializer(serializers.ModelSerializer):
    language = serializers.ReadOnlyField(source="language.name")
    poster_small_vertical_image = serializers.ImageField()
    poster_large_vertical_image = serializers.ImageField()
    poster_small_horizontal_image = serializers.ImageField()
    poster_large_horizontal_image = serializers.ImageField()
    genres = GenersSerializer(many=True)

    def to_representation(self, obj):
        ret = super(ExtrasDetailSerializer, self).to_representation(obj)
        if not utils.check_user_logged_in_and_has_membership(
            self.context.get("request", None).user, obj
        ):
            ret.pop("video_link")
        ret["poster_small_vertical_image"] = utils.format_image_url(
            ret["poster_small_vertical_image"]
        )
        ret["poster_large_vertical_image"] = utils.format_image_url(
            ret["poster_large_vertical_image"]
        )
        ret["poster_small_horizontal_image"] = utils.format_image_url(
            ret["poster_small_horizontal_image"]
        )
        ret["poster_large_horizontal_image"] = utils.format_image_url(
            ret["poster_large_horizontal_image"]
        )
        return ret

    class Meta:
        model = library_models.Extras
        fields = "__all__"
