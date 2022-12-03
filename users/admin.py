"""Integrate with admin module."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext_lazy as _

from . import models as user_models
from settings.models import Settings

DASHBOARD_TITLE = "Dashboard"

admin.site.site_title = DASHBOARD_TITLE
admin.site.site_header = DASHBOARD_TITLE
admin.site.index_title = DASHBOARD_TITLE


@admin.register(user_models.User)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""

    fieldsets = (
        (_("Login info"), {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("full_name", "phone", "country")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("full_name", "email", "phone", "is_staff", "is_superuser")
    search_fields = ("email", "full_name")
    ordering = ("email",)


class LoginPhoneOtpAdmin(admin.ModelAdmin):
    list_display = ["get_phone", "otp"]

    def get_phone(self, obj):
        return obj.user.phone

    get_phone.short_description = "Phone Number"


class MembershipAdmin(admin.ModelAdmin):
    list_display = ("name", "validity_in_days", "price_in_inr", "created", "published")


class UserMembershipAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "get_name",
        "get_phone",
        "get_email",
        "membership",
        "created",
        "expiry_at",
    )
    search_fields = ["user__full_name", "user__phone", "user__email"]

    def get_name(self, obj):
        return obj.user.full_name

    def get_phone(self, obj):
        return obj.user.phone

    def get_email(self, obj):
        return obj.user.email

    get_phone.short_description = "Phone Number"
    get_email.short_description = "Email"
    get_name.short_description = "Full Name"


admin.site.register(user_models.LoginPhoneOtp, LoginPhoneOtpAdmin)
admin.site.register(user_models.ContactUs)
admin.site.register(user_models.MembershipFeatures)
admin.site.register(user_models.Memberships, MembershipAdmin)
admin.site.register(user_models.UserMemberships, UserMembershipAdmin)
