# Generated by Django 4.1.3 on 2022-11-26 18:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("settings", "0002_settings_field_description_settings_image"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="agechoices",
            options={"verbose_name_plural": "Age Choices"},
        ),
        migrations.AlterModelOptions(
            name="languagechoices",
            options={"verbose_name_plural": "Language Choices"},
        ),
        migrations.AlterModelOptions(
            name="settings",
            options={"verbose_name_plural": "Website Settings"},
        ),
    ]
