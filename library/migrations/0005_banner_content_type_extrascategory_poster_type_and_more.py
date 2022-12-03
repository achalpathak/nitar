# Generated by Django 4.1.3 on 2022-12-03 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "library",
            "0004_rename_membership_requried_episodes_membership_required_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="banner",
            name="content_type",
            field=models.CharField(
                choices=[
                    ("MOVIES", "MOVIES"),
                    ("SERIES", "SERIES"),
                    ("EXTRAS", "EXTRAS"),
                ],
                default="MOVIES",
                max_length=25,
            ),
        ),
        migrations.AddField(
            model_name="extrascategory",
            name="poster_type",
            field=models.CharField(
                choices=[
                    ("poster_small_vertical_image", "poster_small_vertical_image"),
                    ("poster_large_vertical_image", "poster_large_vertical_image"),
                    ("poster_small_horizontal_image", "poster_small_horizontal_image"),
                    ("poster_large_horizontal_image", "poster_large_horizontal_image"),
                ],
                default="poster_small_vertical_image",
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="category",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="episodes",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="extras",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="extrascategory",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="movies",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="series",
            name="published",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="upcoming",
            name="published",
            field=models.BooleanField(default=True),
        ),
    ]