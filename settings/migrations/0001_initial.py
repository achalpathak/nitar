# Generated by Django 4.1.3 on 2022-11-15 13:29

from django.db import migrations, models
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    def insertData(apps, schema_editor):
        Settings = apps.get_model("settings", "Settings")
        data = {
            "terms_and_conditions": "Sample Terms and Conditions",
            "about_us": "Sample About Us",
            "privacy_policy": "Sample Privacy Policy",
            "refund_policy": "Sample Refund Policy",
            "name_of_the_app": "Taak",
            "phone": "+91-123456789",
            "email": "info@taak.com",
            "color_primary": "#ffa800",  # yellow
            "color_secondary": "#fff",  # white
            "color_alternate": "#000000",  # black
            "play_store_link": "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
            "apple_store_link": "https://apps.apple.com/in/app/netflix/id363590051",
            "pay_description": "Payment Gateway is secured. For any queries use our contact form.",
            "facebook": "https://facebook.com",
            "twitter": "https://twitter.com",
            "youtube": "https://youtube.com",
            "instagram": "https://instagram.com",
        }

        for _, val in enumerate(data):
            obj = Settings(field=val, value=data[val])
            obj.save()

        LanguageChoices = apps.get_model("settings", "LanguageChoices")
        language_choices = "Hindi,English,Telugu,Assamese,Konkani,Gujarati,kannada,Malayalam,Marathi,Nepali,Tamil,Sikkimese,Urdu,Sanskrit,Punjabi,Haryanvi,Odia"
        for lang in language_choices.split(","):
            obj = LanguageChoices(name=lang)
            obj.save()

        AgeChoices = apps.get_model("settings", "AgeChoices")
        age_choices = "All Ages,13+,16+,18+,U,U/A,A,unspecified"
        for age in age_choices.split(","):
            obj = AgeChoices(name=age)
            obj.save()

    operations = [
        migrations.CreateModel(
            name="AgeChoices",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="LanguageChoices",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Settings",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("field", models.CharField(blank=True, max_length=255, null=True)),
                ("value", models.TextField(blank=True, null=True)),
                ("toggle_value", models.BooleanField(default=False)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.RunPython(insertData),
    ]
