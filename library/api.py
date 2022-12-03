from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as library_models
from . import serializers
from rest_framework import status
from django.db.models import Q
from itertools import chain
from django.db.models import CharField, Value


class BannerInfo(APIView):
    serializer = serializers.BannerInfoSerializer

    def get(self, request):
        welcome_banner_objs = library_models.Banner.objects.filter(
            banner_type=library_models.BANNER_WELCOME, published=True
        )
        poster_banner_objs = library_models.Banner.objects.filter(
            banner_type=library_models.BANNER_DEFAULT, published=True
        )

        data = {
            "welcome_banner": self.serializer(welcome_banner_objs, many=True).data,
            "poster_banner": self.serializer(poster_banner_objs, many=True).data,
        }

        return Response({"result": data})


class NewsLetterSubscriptionAPI(APIView):
    def post(self, request):
        try:
            email = request.data["email"]
            if email is None:
                return Response(
                    {"message": f"email field cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            library_models.NewsLetterSubscription.objects.update_or_create(
                email=email,
                defaults={"email": email},
            )
            return Response({"result": "Thank you for subscribing to the newsletter."})
        except KeyError as e:
            return Response(
                {"message": f"{e} field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class HomePageAPI(APIView):
    serializer = serializers.HomePageListSerializer

    def get(self, request):
        data = {"categories": [],"extra_categories": [],}
        categories = (
            library_models.Category.objects.filter(published=True)
            .values("name", "poster_type")
            .order_by("rankings")
        )
        extra_categories = (
            library_models.ExtrasCategory.objects.filter(published=True)
            .values("name", "poster_type")
        )
        print(extra_categories)
        for ec in extra_categories:
            _dto = {
                "name": ec.get("name"),
                "poster_type": ec.get("poster_type"),
                "data": [],
            }
            category_objs = (
                library_models.Extras.objects
                .filter(extras_category__name=ec.get("name"))
            )
            # TODO: optimize later if possible
            for obj in category_objs:
                obj.content_type = "extras"
                _dto["data"].append(self.serializer(obj).data)
            data["extra_categories"].append(_dto)
            
        for category in categories:
            _dto = {
                "name": category.get("name"),
                "poster_type": category.get("poster_type"),
                "data": [],
            }
            category_objs = (
                library_models.CategoryMovieSeriesMapping.objects.select_related(
                    "movies", "series"
                )
                .filter(category__name=category.get("name"))
                .order_by("rankings")
            )
            # TODO: optimize later if possible
            for obj in category_objs:
                if obj.movies:
                    dto = obj.movies
                    dto.content_type = "movies"
                else:
                    dto = obj.series
                    dto.content_type = "series"
                dto.rankings = obj.rankings
                _dto["data"].append(self.serializer(dto).data)
            data["categories"].append(_dto)
        return Response({"result": data})


class UpcomingAPI(APIView):
    serializer = serializers.UpcomingListSerializer

    def get(self, request):
        upcoming_objs = library_models.Upcoming.objects.filter(published=True).order_by(
            "created"
        )
        data = self.serializer(upcoming_objs, many=True).data
        return Response({"result": data})


class SearchAPI(APIView):
    def get(self, request):
        try:
            query = request.GET["q"]
            if len(query) <= 1:
                return Response(
                    {"message": f"Enter atleast 2 characters."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            lookups = Q(name__icontains=query)
            movies_results = (
                library_models.Movies.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image", "slug")
                .annotate(content_type=Value("movies", output_field=CharField()))
                .distinct()
            )
            series_results = (
                library_models.Series.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image", "slug")
                .annotate(content_type=Value("series", output_field=CharField()))
                .distinct()
            )
            episodes_results = (
                library_models.Episodes.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image", "slug")
                .annotate(content_type=Value("episodes", output_field=CharField()))
                .distinct()
            )
            extras_results = (
                library_models.Extras.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image", "slug")
                .annotate(content_type=Value("extras", output_field=CharField()))
                .distinct()
            )
            upcoming_results = (
                library_models.Upcoming.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image", "slug")
                .annotate(content_type=Value("upcoming", output_field=CharField()))
                .distinct()
            )

            data = list(
                chain(
                    movies_results,
                    series_results,
                    episodes_results,
                    extras_results,
                    upcoming_results,
                )
            )
            return Response({"result": data})

        except KeyError as e:
            return Response(
                {"message": f"{e} field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MoviesAPI(APIView):
    serializer = serializers.MovieDetailSerializer

    def get(self, request, slug):
        data = []
        movies_results = library_models.Movies.objects.filter(slug=slug).first()
        if movies_results:
            data = self.serializer(movies_results, context={"request": request}).data
        return Response({"result": data})


class SeriesAPI(APIView):
    serializer = serializers.SeriesDetailSerializer

    def get(self, request, slug):
        data = []
        series_results = (
            library_models.Series.objects.prefetch_related("episodes_set")
            .filter(slug=slug)
            .first()
        )
        if series_results:
            data = self.serializer(series_results, context={"request": request}).data
        return Response({"result": data})


class EpisodesAPI(APIView):
    serializer = serializers.EpisodesDetailSerializer
    serializer_other_episodes = serializers.EpisodesDetailWithoutSeriesSerializer

    def get(self, request, slug):
        data = []
        episodes_results = library_models.Episodes.objects.filter(slug=slug).first()
        if episodes_results:
            print("hello world")
            data = self.serializer(episodes_results, context={"request": request}).data
            all_episodes_results = library_models.Episodes.objects.filter(
                series=episodes_results.series
            )
            data["other_episodes"] = self.serializer_other_episodes(
                all_episodes_results, many=True, context={"request": request}
            ).data
        return Response({"result": data})


class UpcomingDetailsAPI(APIView):
    serializer = serializers.UpcomingDetailSerializer

    def get(self, request, slug):
        data = []
        upcoming_results = library_models.Upcoming.objects.filter(slug=slug).first()
        if upcoming_results:
            data = self.serializer(upcoming_results).data
        return Response({"result": data})


class ExtrasAPI(APIView):
    serializer = serializers.ExtrasDetailSerializer

    def get(self, request, slug):
        data = []
        extras_results = library_models.Extras.objects.filter(slug=slug).first()
        if extras_results:
            data = self.serializer(extras_results, context={"request": request}).data
        return Response({"result": data})
