from . import api
from django.urls import re_path


urlpatterns = [
    # re_path(r"banner/$", api.BannerInfo.as_view()),
    # re_path(r"search/$", api.TermsAndConditions.as_view()),
    re_path(r"home_page_listings/$", api.HomePageAPI.as_view()),
    re_path(r"upcoming/$", api.UpcomingAPI.as_view()),
    re_path(r"newsletter_subscription/$", api.NewsLetterSubscriptionAPI.as_view()),
]
