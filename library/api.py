from rest_framework.response import Response
from rest_framework.views import APIView
from . import models as library_models
from . import serializers
from rest_framework import status


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
        data = {"categories": []}
        categories = (
            library_models.Category.objects.filter(published=True)
            .values_list("name", flat=True)
            .order_by("rankings")
        )
        for category in categories:
            category_dto_obj = {"name": category, "category_items": []}
            category_objs = (
                library_models.CategoryMovieSeriesMapping.objects.select_related(
                    "movies", "series"
                )
                .filter(category__name=category)
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
                category_dto_obj["category_items"].append(self.serializer(dto).data)
            data["categories"].append(category_dto_obj)
        return Response({"result": data})
