from random import randint
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models as user_models
from django.db import transaction

User = get_user_model()


class RegisterUserSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    full_name = serializers.CharField(max_length=30, required=True)
    email = serializers.EmailField(required=False)
    age_above_18 = serializers.BooleanField(required=True)
    terms_conditions_agreed = serializers.BooleanField(required=True)

    def validate_phone(self, phone):
        if len(phone) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits.")
        if not phone.isnumeric():
            raise serializers.ValidationError(
                "Phone number should only contain numbers."
            )
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError("Phone number is already registered.")
        return phone

    def validate_email(self, email):
        if email:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already registered.")
        return email

    def validate_age_above_18(self, age_above_18):
        if not age_above_18:
            raise serializers.ValidationError(
                "Please agree to age 18 or above to proceed."
            )
        return age_above_18

    def validate_terms_conditions_agreed(self, terms_conditions_agreed):
        if not terms_conditions_agreed:
            raise serializers.ValidationError(
                "Please agree to terms and conditions to proceed."
            )
        return terms_conditions_agreed

    def create(self, validated_data):
        with transaction.atomic():
            user = UserSerializer(data=validated_data)
            if user.is_valid(raise_exception=True):
                user.save()
        return validated_data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user_obj, _ = User.objects.update_or_create(
            phone=validated_data["phone"], defaults=validated_data
        )
        user_obj.save()
        return user_obj


class ContactUsSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if data.get("email") is None and data.get("phone") is None:
            raise serializers.ValidationError(
                {"message": "Fill email or phone number."}
            )
        return data

    class Meta:
        model = user_models.ContactUs
        fields = "__all__"


class PhoneOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)

    def validate_phone(self, phone):
        if len(phone) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits.")
        if not phone.isnumeric():
            raise serializers.ValidationError(
                "Phone number should only contain numbers."
            )
        return phone

    def create(self, validated_data):
        try:
            with transaction.atomic():
                # TODO: add check if phone is already registered with different user and activated too.
                user_obj = user_models.User.objects.get(phone=validated_data["phone"])
                data = {
                    "otp": randint(100000, 999999),
                    "valid_till": datetime.now() + timedelta(minutes=15),
                    "attempts_remaining": 3,
                }
                otp_obj, created = user_models.LoginPhoneOtp.objects.update_or_create(
                    user=user_obj, defaults=data
                )
                otp_obj.save()
                return otp_obj
        except user_models.User.DoesNotExist:
            raise serializers.ValidationError(
                {"message": "Phone number is not registered."}
            )


class VerifyOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    otp = serializers.IntegerField(required=True)

    def validate_phone(self, phone):
        if len(phone) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits.")
        if not phone.isnumeric():
            raise serializers.ValidationError(
                "Phone number should only contain numbers."
            )
        return phone

    def validate_otp(self, otp):
        if len(str(otp)) != 6:
            raise serializers.ValidationError("OTP should be 6 digits.")
        return otp

    def create(self, validated_data):
        try:
            phone_otp_obj = user_models.LoginPhoneOtp.objects.get(
                user__phone=validated_data["phone"]
            )
            if phone_otp_obj.attempts_remaining >= 1:
                if timezone.now() > phone_otp_obj.valid_till:
                    raise serializers.ValidationError(
                        {"message": "OTP has expired. Retry with new OTP."}
                    )

                if validated_data["otp"] != int(phone_otp_obj.otp):
                    phone_otp_obj.attempts_remaining = (
                        phone_otp_obj.attempts_remaining - 1
                    )
                    phone_otp_obj.save()
                    raise serializers.ValidationError(
                        {
                            "message": f"Wrong OTP. { phone_otp_obj.attempts_remaining} attempts remaining."
                        }
                    )
                # OTP is verifed
                phone_otp_obj.user.phone_verified = True
                phone_otp_obj.user.is_active = True
                phone_otp_obj.user.save()
                phone_otp_obj.delete()
                return phone_otp_obj.user
            else:
                raise serializers.ValidationError(
                    {"message": "OTP attempts exhausted. Retry with new OTP."}
                )
        except user_models.LoginPhoneOtp.DoesNotExist:
            raise serializers.ValidationError(
                {"message": "Phone number is not registered."}
            )
