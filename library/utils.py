import datetime
import os
import uuid

def image_path(instance, filename):
    today_date = str(datetime.datetime.today().date())
    final_path = os.path.join('posters',today_date + uuid.uuid4().hex + '.'+filename.split('.')[-1])
    return final_path