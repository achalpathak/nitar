from django.contrib import admin
from .views import front
from django.urls import path, include, re_path

urlpatterns = [
    path("admin", admin.site.urls),
    re_path("api/users/", include("users.urls")),
    re_path("api/settings/", include("settings.urls")),
    re_path("api/library/", include("library.urls")),
    re_path(r".*", front, name="front"),
]
