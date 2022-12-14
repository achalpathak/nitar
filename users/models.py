from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator

from django.contrib.auth.models import User, AbstractUser, BaseUserManager

from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel
from django.utils import timezone
from datetime import timedelta
import json

PHONE_CODE_CHOICES = [
    (c["code"], c["code"])
    for i, c in enumerate(json.loads(open("./settings/phone_code.json").read()))
]


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("full_name", "Admin Website")
        extra_fields.setdefault("phone", "0123456789")
        extra_fields.setdefault("phone_code", "+91")
        extra_fields.setdefault("phone_verified", True)
        extra_fields.setdefault("email_verified", True)
        extra_fields.setdefault("age_above_18", True)
        extra_fields.setdefault("terms_conditions_agreed", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser, TimeStampedModel):
    """User model."""

    username = None
    first_name = None
    last_name = None
    full_name = models.CharField(max_length=30, blank=True, null=True)
    password = models.CharField(_("password"), max_length=250, blank=True, null=True)
    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)
    phone = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(10)],
        blank=True,
        null=True,
    )
    age_above_18 = models.BooleanField(default=False)
    terms_conditions_agreed = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    phone_code = models.CharField(
        max_length=10, default="+91", choices=PHONE_CODE_CHOICES
    )
    phone_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    @property
    def has_active_membership(self):
        membership = UserMemberships.objects.filter(
            user=self, expiry_at__lte=timezone.now(), published=True
        ).first()
        if membership:
            return True
        else:
            return False

    @property
    def currency_mode(self):
        if self.phone_code == "+91":
            return "INR"
        else:
            return "USD"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


class LoginEmailOtp(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, validators=[MinLengthValidator(6)])
    attempts_remaining = models.PositiveIntegerField(default=3)
    valid_till = models.DateTimeField()

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name_plural = "OTPs"


CONTACT_US_CHOICES = [
    ("Open", "Open"),
    ("Issue Resolved", "Issue Resolved"),
]


class ContactUs(TimeStampedModel):
    full_name = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(10)],
        blank=True,
        null=True,
    )
    subject = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField()
    status = models.CharField(
        max_length=50,
        choices=CONTACT_US_CHOICES,
        default="Open",
    )

    def __str__(self):
        return f"{self.full_name} | {self.subject}"

    class Meta:
        verbose_name_plural = "Contact Us Queries"


class MembershipFeatures(TimeStampedModel):
    name = models.CharField(max_length=250)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Membership Features"


class Memberships(TimeStampedModel):
    name = models.CharField(max_length=250)
    validity_in_days = models.PositiveIntegerField(default=1)
    price_in_inr = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )
    price_in_dollar = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )
    membership_features = models.ManyToManyField(MembershipFeatures)
    published = models.BooleanField(default=True)

    @property
    def get_membership_features(self):
        return list(self.membership_features.values_list("name", flat=True))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Memberships"


class UserMemberships(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    membership = models.ForeignKey(Memberships, on_delete=models.CASCADE)
    expiry_at = models.DateTimeField(
        blank=True, help_text="NOTE: Field will autofill when saved."
    )
    published = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.full_name} | {self.membership.name}"

    class Meta:
        verbose_name_plural = "User Memberships"

    def save(self, *args, **kwargs):
        if not self.expiry_at:
            plan_expiry = timezone.now() + timedelta(
                days=self.membership.validity_in_days
            )
            self.expiry_at = plan_expiry
        super(UserMemberships, self).save(*args, **kwargs)
