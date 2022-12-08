# Generated by Django 4.1.3 on 2022-12-08 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0002_order_gateway_order_membership_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="stripe_session_id",
            field=models.CharField(
                blank=True, max_length=200, null=True, verbose_name="Stripe Session ID"
            ),
        ),
    ]
