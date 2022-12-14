from . import api
from django.urls import re_path


urlpatterns = [
    re_path(r"website_config_settings/$", api.WebsiteConfigSettingsAPI.as_view()),
    re_path(r"terms_and_conditions/$", api.TermsAndConditions.as_view()),
    re_path(r"about_us/$", api.AboutUs.as_view()),
    re_path(r"privacy_policy/$", api.PrivacyPolicy.as_view()),
    re_path(r"refund_policy/$", api.RefundPolicy.as_view()),
    re_path(r"country/$", api.CountriesAPI.as_view()),
]
