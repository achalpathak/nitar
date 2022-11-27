from django.contrib import admin
from django.utils.html import format_html

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


class BannerAdmin(admin.ModelAdmin):
    def website_banner_tag(self, obj):
        return format_html(
            '<img src="{}" width="auto" height="150px" />'.format(
                obj.website_banner.url
            )
        )

    def mobile_banner_tag(self, obj):
        return format_html(
            '<img src="{}" width="auto" height="150px" />'.format(obj.mobile_banner.url)
        )

    website_banner_tag.short_description = "Website Banner"
    mobile_banner_tag.short_description = "Website Banner"

    list_display = (
        "website_banner_tag",
        "mobile_banner_tag",
        "banner_type",
        "url",
        "url_type",
        "published",
    )


admin.site.register(Category)
admin.site.register(Geners)
admin.site.register(Movies, ReadOnlySlug)
admin.site.register(CategoryMovieSeriesMapping)
admin.site.register(ExtrasCategory)
admin.site.register(Upcoming, ReadOnlySlug)
admin.site.register(Banner, BannerAdmin)
admin.site.register(Series, ReadOnlySlug)
admin.site.register(Extras, ReadOnlySlug)
admin.site.register(Episodes, ReadOnlySlug)
admin.site.register(NewsLetterSubscription)
