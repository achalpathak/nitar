# Generated by Django 4.1.3 on 2022-12-21 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0006_alter_user_password"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="password",
            field=models.CharField(
                blank=True, max_length=250, null=True, verbose_name="password"
            ),
        ),
    ]
