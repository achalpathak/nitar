from django.contrib import admin

# Register your models here.
from .models import (
    ExtrasCategory,
    Upcoming,
    Category,
    Banner,
    Geners,
    Movies,
    Series,
    Extras,
    Episodes,
    CategoryMovieSeriesMapping,
)

admin.site.register(Category)
admin.site.register(Geners)
admin.site.register(Movies)
admin.site.register(CategoryMovieSeriesMapping)
admin.site.register(ExtrasCategory)
admin.site.register(Upcoming)
admin.site.register(Banner)
admin.site.register(Series)
admin.site.register(Extras)
admin.site.register(Episodes)
