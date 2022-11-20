import datetime
import os
import uuid


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
