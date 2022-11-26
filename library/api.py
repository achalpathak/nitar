from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as library_models
from . import serializers
from rest_framework import status
from django.db.models import Q
from itertools import chain


# class BannerInfo(APIView):
#     def post(self, request):
#         if request.data.get("banner_type") == library_models.BANNER_WELCOME:
#             objs = library_models.Banner.objects.filter(
#                 banner_type=library_models.BANNER_WELCOME, published=True
#             )
#             print(objs[0].content_object.__dict__)
#         elif request.data.get("banner_type") == library_models.BANNER_DEFAULT:
#             objs = library_models.Banner.objects.filter(
#                 banner_type=library_models.BANNER_DEFAULT, published=True
#             )
#         else:
#             return Response(
#                 {"message": "banner_type value invalid."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         return Response({"result": "hello"})


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
        data = {"categories": None, "categories_data": []}
        categories = (
            library_models.Category.objects.filter(published=True)
            .values("name", "poster_type")
            .order_by("rankings")
        )
        data["categories"] = categories

        for category in categories:
            category_dto_obj = {category.get("name"): []}
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
                category_dto_obj[category.get("name")].append(self.serializer(dto).data)
            data["categories_data"].append(category_dto_obj)
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
                .values("name", "description", "poster_small_vertical_image")
                .distinct()
            )
            series_results = (
                library_models.Series.objects.filter(lookups)
                .values(
                    "name",
                    "description",
                    "poster_small_vertical_image",
                )
                .distinct()
            )
            episodes_results = (
                library_models.Episodes.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image")
                .distinct()
            )
            extras_results = (
                library_models.Extras.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image")
                .distinct()
            )
            upcoming_results = (
                library_models.Upcoming.objects.filter(lookups)
                .values("name", "description", "poster_small_vertical_image")
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
        movies_results = library_models.Movies.objects.filter(slug=slug).first()
        data = self.serializer(movies_results).data
        return Response({"result": data})


class SeriesAPI(APIView):
    serializer = serializers.SeriesDetailSerializer

    def get(self, request, slug):
        series_results = (
            library_models.Series.objects.prefetch_related("episodes_set")
            .filter(slug=slug)
            .first()
        )
        data = self.serializer(series_results).data
        return Response({"result": data})


class EpisodesAPI(APIView):
    serializer = serializers.EpisodesDetailSerializer
    serializer_other_episodes = serializers.EpisodesDetailWithoutSeriesSerializer

    def get(self, request, slug):
        episodes_results = library_models.Episodes.objects.filter(slug=slug).first()
        data = self.serializer(episodes_results).data
        if episodes_results:
            all_episodes_results = library_models.Episodes.objects.filter(
                series=episodes_results.series
            )
            data["other_episodes"] = self.serializer_other_episodes(
                all_episodes_results, many=True
            ).data
        return Response({"result": data})


class UpcomingDetailsAPI(APIView):
    serializer = serializers.UpcomingDetailSerializer

    def get(self, request, slug):
        upcoming_results = library_models.Upcoming.objects.filter(slug=slug).first()
        data = self.serializer(upcoming_results).data
        return Response({"result": data})


class ExtrasAPI(APIView):
    serializer = serializers.ExtrasDetailSerializer

    def get(self, request, slug):
        extras_results = library_models.Extras.objects.filter(slug=slug).first()
        data = self.serializer(extras_results).data
        return Response({"result": data})
