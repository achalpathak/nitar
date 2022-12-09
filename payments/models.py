from django.db import models
from django.db.models.fields import CharField
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()
from users.models import Memberships, UserMemberships


class PaymentStatus:
    SUCCESS = "Success"
    FAILURE = "Failure"
    PENDING = "Pending"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    membership = models.ForeignKey(Memberships, on_delete=models.CASCADE)
    user_membership = models.ForeignKey(
        UserMemberships, blank=True, null=True, on_delete=models.CASCADE
    )
    membership_plan = models.CharField(
        _("Membership Name"), max_length=30, blank=True, null=True
    )
    currency = models.CharField(_("Currency"), max_length=10, blank=True, null=True)
    amount = models.FloatField(_("Amount"), null=False, blank=False)
    status = CharField(
        _("Payment Status"),
        default=PaymentStatus.PENDING,
        max_length=254,
        blank=False,
        null=False,
    )
    provider_order_id = models.CharField(
        _("Order ID"), max_length=40, null=True, blank=True
    )
    payment_id = models.CharField(_("Payment ID"), max_length=36, null=True, blank=True)
    signature_id = models.CharField(
        _("Signature ID"), max_length=128, null=True, blank=True
    )
    stripe_payment_intent = models.CharField(
        _("Stripe ID"), max_length=200, null=True, blank=True
    )
    stripe_session_id = models.CharField(
        _("Stripe Session ID"), max_length=200, null=True, blank=True
    )
    gateway = models.CharField(_("Gateway"), max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.id}-{self.user.full_name}-{self.membership_plan}-{self.status}"
