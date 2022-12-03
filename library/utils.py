import datetime
import os
import random
import uuid
import string
from django.utils.text import slugify


def image_path(instance, filename):
    extension = filename.split(".")[-1]
    if len(extension) > 5:  # to handle seed_data file upload
        extension = "jpeg"
    image_type = "posters"
    if instance._meta.model.__name__ == "Settings":
        image_type = "config"
    today_date = str(datetime.datetime.today().date())
    final_path = os.path.join(
        image_type, today_date + uuid.uuid4().hex + "." + extension
    )
    return final_path


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def unique_slug_generator(instance, new_slug=None, episodes=False):
    if new_slug is not None:
        slug = new_slug
    else:
        name = instance.name
        if episodes:
            name = f"{instance.series.slug}-{instance.name}"
        slug = slugify(name)
    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = "{slug}-{randstr}".format(
            slug=slug, randstr=random_string_generator(size=4)
        )
        return unique_slug_generator(instance, new_slug=new_slug)
    return slug


def check_user_logged_in_and_has_membership(user_obj, data):
    try:
        if data.membership_required:
            if user_obj.has_active_membership:  # checks user has membership or not
                return True
            else:
                return False
        else:
            return True
    except AttributeError:  # it will be raised since Anonymous user doesnt have membership
        return False


def show_price_in_dollar(user_obj, data):
    try:
        if user_obj.country.code == "IN":
            return False
        else:
            return True
    except AttributeError:  # default inr price will be shown
        return False
