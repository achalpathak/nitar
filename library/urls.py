from . import api
from django.urls import re_path, path


urlpatterns = [
    re_path(r"banner/$", api.BannerInfo.as_view()),
    re_path(r"search/$", api.SearchAPI.as_view()),
    re_path(r"home_page_listings/$", api.HomePageAPI.as_view()),
    path("upcoming/", api.UpcomingAPI.as_view()),
    re_path(r"newsletter_subscription/$", api.NewsLetterSubscriptionAPI.as_view()),
    # media details api
    path("movies/<slug:slug>/", api.MoviesAPI.as_view()),
    path("series/<slug:slug>/", api.SeriesAPI.as_view()),
    path("episodes/<slug:slug>/", api.EpisodesAPI.as_view()),
    path("upcoming/<slug:slug>/", api.UpcomingDetailsAPI.as_view()),
    path("extras/<slug:slug>/", api.ExtrasAPI.as_view()),
]
