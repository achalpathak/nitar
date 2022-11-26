# Generated by Django 4.1.3 on 2022-11-20 07:42

from django.db import migrations, models
import library.utils
import settings.models


class Migration(migrations.Migration):

    dependencies = [
        ("settings", "0001_initial"),
    ]

    def insertData(apps, schema_editor):
        import urllib.request
        from django.core.files import File

        logo_url = urllib.request.urlretrieve(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
        )
        favicon_url = urllib.request.urlretrieve(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
        )

        Settings = apps.get_model("settings", "Settings")
        data = {
            "logo_url": File(open(logo_url[0], "rb")),
            "favicon_url": File(open(favicon_url[0], "rb")),
        }

        for _, val in enumerate(data):
            obj = Settings(field=val, image=data[val])
            obj.save()

    operations = [
        migrations.AddField(
            model_name="settings",
            name="field_description",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="settings",
            name="image",
            field=models.ImageField(
                blank=True,
                help_text="Max image size should be 512 kB",
                null=True,
                upload_to=library.utils.image_path,
                validators=[settings.models.validate_poster_small_vertical_image],
            ),
        ),
        migrations.RunPython(insertData),
    ]
