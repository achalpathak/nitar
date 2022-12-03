# Generated by Django 4.1.3 on 2022-12-03 11:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_user_country"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactus",
            name="status",
            field=models.CharField(
                choices=[("Open", "Open"), ("Issue Resolved", "Issue Resolved")],
                default="Open",
                max_length=50,
            ),
        ),
    ]
