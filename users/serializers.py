import os
from random import randint
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth import get_user_model
import jwt
from library import utils
from . import models as user_models
from django.db import transaction
from django.conf import settings

User = get_user_model()
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import authenticate
from config.mail import send_email_otp, send_email_forgot_password


class RegisterUserSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    full_name = serializers.CharField(max_length=30, required=True)
    email = serializers.EmailField(required=True)
    age_above_18 = serializers.BooleanField(required=True)
    phone_code = serializers.CharField(required=True)
    terms_conditions_agreed = serializers.BooleanField(required=True)
    password = serializers.CharField(min_length=4, required=True)

    def validate_phone(self, phone):
        if len(phone) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits.")
        if not phone.isnumeric():
            raise serializers.ValidationError(
                "Phone number should only contain numbers."
            )
        # if User.objects.filter(phone=phone).exists():
        #     raise serializers.ValidationError("Phone number is already registered.")
        return phone

    def validate_email(self, email):
        if email:
            if User.objects.filter(email=email, email_verified=True).exists():
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
            user_obj, _ = User.objects.update_or_create(
                email=validated_data["email"], defaults=validated_data
            )
            user_obj.set_password(validated_data["password"])
            user_obj.save()
            data = {
                "otp": randint(100000, 999999),
                "valid_till": datetime.now() + timedelta(minutes=15),
                "attempts_remaining": 3,
            }
            otp_obj, created = user_models.LoginEmailOtp.objects.update_or_create(
                user=user_obj, defaults=data
            )
            otp_obj.save()
            send_email_otp(to_email=validated_data["email"], otp=data["otp"])
        return validated_data


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


class MembershipFeaturesSerializers(serializers.ModelSerializer):
    class Meta:
        model = user_models.MembershipFeatures
        fields = ["name"]


class PlansSerializer(serializers.ModelSerializer):
    get_membership_features = serializers.JSONField()

    def to_representation(self, obj):
        ret = super(PlansSerializer, self).to_representation(obj)
        if utils.show_price_in_dollar(self.context.get("request", None).user, obj):
            ret.pop("price_in_inr")
        else:
            ret.pop("price_in_dollar")
        return ret

    class Meta:
        model = user_models.Memberships
        exclude = ["membership_features"]


class EmailOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        if email:
            if User.objects.filter(email=email, email_verified=True).exists():
                raise serializers.ValidationError("Email is already verified.")
        return email

    def create(self, validated_data):
        try:
            with transaction.atomic():
                user_obj = user_models.User.objects.filter(
                    email=validated_data["email"]
                ).last()
                if user_obj is None:
                    raise user_models.User.DoesNotExist()

                data = {
                    "otp": randint(100000, 999999),
                    "valid_till": datetime.now() + timedelta(minutes=15),
                    "attempts_remaining": 3,
                }
                otp_obj, created = user_models.LoginEmailOtp.objects.update_or_create(
                    user=user_obj, defaults=data
                )
                otp_obj.save()
                send_email_otp(to_email=validated_data["email"], otp=data["otp"])
                return otp_obj
        except user_models.User.DoesNotExist:
            raise serializers.ValidationError({"message": "Email is not registered."})


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.IntegerField(required=True)

    def validate_otp(self, otp):
        if len(str(otp)) != 6:
            raise serializers.ValidationError("OTP should be 6 digits.")
        return otp

    def create(self, validated_data):
        try:
            email_otp_obj = user_models.LoginEmailOtp.objects.get(
                user__email=validated_data["email"]
            )
            if email_otp_obj.attempts_remaining >= 1:
                if timezone.now() > email_otp_obj.valid_till:
                    raise serializers.ValidationError(
                        {"message": "OTP has expired. Retry with new OTP."}
                    )

                if validated_data["otp"] != int(email_otp_obj.otp):
                    email_otp_obj.attempts_remaining = (
                        email_otp_obj.attempts_remaining - 1
                    )
                    email_otp_obj.save()
                    raise serializers.ValidationError(
                        {
                            "message": f"Wrong OTP. { email_otp_obj.attempts_remaining} attempts remaining."
                        }
                    )
                # OTP is verifed
                email_otp_obj.user.email_verified = True
                email_otp_obj.user.is_active = True
                email_otp_obj.user.save()
                email_otp_obj.delete()

                return email_otp_obj.user
            else:
                raise serializers.ValidationError(
                    {"message": "OTP attempts exhausted. Retry with new OTP."}
                )
        except user_models.LoginEmailOtp.DoesNotExist:
            raise serializers.ValidationError({"message": "Email is not registered."})


class UpdatePhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    phone_code = serializers.CharField(required=True)

    def validate_phone(self, phone):
        if len(phone) != 10:
            raise serializers.ValidationError("Phone number should be 10 digits.")
        if not phone.isnumeric():
            raise serializers.ValidationError(
                "Phone number should only contain numbers."
            )
        return phone

    def create(self, validated_data):
        # check if phone already linked
        other_user = User.objects.filter(
            phone=validated_data["phone"], phone_verified=True
        ).first()
        if other_user:
            raise serializers.ValidationError(
                "Phone number is already linked with another user."
            )
        user = self.context.get("request", None).user
        user.phone = validated_data["phone"]
        user.phone_code = validated_data["phone_code"]
        user.save()
        return user


class UpdatePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=4, required=True)

    def create(self, validated_data):
        user = self.context.get("request", None).user
        user.set_password(validated_data["password"])
        update_session_auth_hash(self.context.get("request", None), user)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    password = serializers.CharField(min_length=4, required=True)

    def validate_email(self, email):
        if email:
            if User.objects.filter(email=email, email_verified=False).exists():
                raise serializers.ValidationError("Email is not verified.")
        return email

    def create(self, validated_data):
        user = authenticate(
            username=validated_data["email"],
            password=validated_data["password"],
        )
        if user is not None:
            return user
        else:
            raise serializers.ValidationError(
                {"message": "Login Failed. Please check the email/password."}
            )


class ForgotPasswordSendEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def create(self, validated_data):
        user = User.objects.filter(
            email=validated_data["email"], is_active=True
        ).first()
        if user:
            exp = datetime.now() + timedelta(hours=1)
            encoded_jwt = jwt.encode(
                {
                    "email": validated_data["email"],
                    "full_name": user.full_name,
                    "exp": exp,
                },
                settings.SECRET_KEY,
                algorithm="HS256",
            )
            # send email here
            reset_link = f"{os.environ['SERVER_DOMAIN']}/forgot-password?token={encoded_jwt}"
            send_email_forgot_password(to_email=validated_data["email"],reset_link=reset_link)
        return True


class ForgotPasswordVerifySerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(min_length=4, required=True)

    def create(self, validated_data):
        try:
            decode_token = jwt.decode(
                validated_data["token"], settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = User.objects.filter(
                email=decode_token["email"], is_active=True
            ).first()
            user.set_password(validated_data["password"])
            user.save()
            return True
        except Exception as e:
            print(f"Token Error-{str(e)}")
            raise serializers.ValidationError(
                {"message": "Invalid Token. Please reset password again."}
            )
