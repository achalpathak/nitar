from django.contrib import admin
from .views import front
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = []
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path("admin", admin.site.urls),
    re_path("api/users/", include("users.urls")),
    re_path("api/settings/", include("settings.urls")),
    re_path("api/library/", include("library.urls")),
    re_path(r".*", front, name="front"),
]
