# Generated by Django 4.1.3 on 2022-11-27 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_membershipfeatures_memberships_usermemberships"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="membershipfeatures",
            options={"verbose_name_plural": "Membership Features"},
        ),
        migrations.AlterField(
            model_name="usermemberships",
            name="expiry_at",
            field=models.DateTimeField(
                blank=True, help_text="NOTE: Field will autofill when saved."
            ),
        ),
    ]
