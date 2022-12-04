# Generated by Django 4.1.3 on 2022-12-04 11:58

from django.db import migrations, models
import library.models
import library.utils


class Migration(migrations.Migration):

    dependencies = [
        ("library", "0006_alter_banner_mobile_banner_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="banner",
            name="mobile_banner",
            field=models.ImageField(
                help_text="Max image size should be 512 kB",
                upload_to=library.utils.image_path,
                validators=[library.models.validate_poster_small_vertical_image],
            ),
        ),
        migrations.AlterField(
            model_name="banner",
            name="website_banner",
            field=models.ImageField(
                help_text="Max image size should be 512 kB",
                upload_to=library.utils.image_path,
                validators=[library.models.validate_poster_small_vertical_image],
            ),
        ),
    ]
