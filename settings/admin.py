from django.contrib import admin
from .models import Settings, AgeChoices, LanguageChoices

# Register your models here.
admin.site.register(Settings)
admin.site.register(AgeChoices)
admin.site.register(LanguageChoices)
