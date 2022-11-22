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
    NewsLetterSubscription,
)


class ReadOnlySlug(admin.ModelAdmin):
    readonly_fields = ("slug",)


admin.site.register(Category)
admin.site.register(Geners)
admin.site.register(Movies, ReadOnlySlug)
admin.site.register(CategoryMovieSeriesMapping)
admin.site.register(ExtrasCategory)
admin.site.register(Upcoming, ReadOnlySlug)
admin.site.register(Banner)
admin.site.register(Series, ReadOnlySlug)
admin.site.register(Extras, ReadOnlySlug)
admin.site.register(Episodes, ReadOnlySlug)
admin.site.register(NewsLetterSubscription)
