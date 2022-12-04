from django.contrib import admin
from django.utils.html import format_html
import csv
from django.http import HttpResponse

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
        if obj.website_banner:
            return format_html(
                '<img src="{}" width="auto" height="150px" />'.format(
                    obj.website_banner.url
                )
            )
        else:
            return None

    def mobile_banner_tag(self, obj):
        if obj.mobile_banner:
            return format_html(
                '<img src="{}" width="auto" height="150px" />'.format(
                    obj.mobile_banner.url
                )
            )
        else:
            return None

    website_banner_tag.short_description = "Website Banner"
    mobile_banner_tag.short_description = "Mobile Banner"

    list_display = (
        "website_banner_tag",
        "mobile_banner_tag",
        "banner_type",
        "url",
        "url_type",
        "published",
    )


class ExportCsvMixin:
    def export_as_csv(self, request, queryset):

        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename={}.csv".format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    export_as_csv.short_description = "Export Selected"


class ExportOption(admin.ModelAdmin, ExportCsvMixin):
    def get_actions(self, request):
        actions = super().get_actions(request)
        if "delete_selected" in actions:
            del actions["delete_selected"]
        return actions

    actions = ["export_as_csv"]


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
admin.site.register(NewsLetterSubscription, ExportOption)
