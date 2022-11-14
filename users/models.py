from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator

from django.contrib.auth.models import User, AbstractUser, BaseUserManager

from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

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
        extra_fields.setdefault("age", 18)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser,TimeStampedModel):
    """User model."""

    username = None
    first_name = None
    last_name = None
    full_name = models.CharField(max_length=30,blank=True, null=True)
    password = models.EmailField(_("password"), blank=True, null=True)
    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)
    phone = models.CharField(max_length=10, validators=[MinLengthValidator(10)], unique=True, blank=True, null=True)
    age_above_18 = models.BooleanField(default=False)
    terms_conditions_agreed = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()



class LoginPhoneOtp(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, validators=[MinLengthValidator(6)])
    attempts_remaining = models.PositiveIntegerField(default=3)
    valid_till = models.DateTimeField()
    
    def __str__(self):
        return self.user.phone