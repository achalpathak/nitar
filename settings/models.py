from django.db import models
from model_utils.models import TimeStampedModel
from library import utils
from django.core.exceptions import ValidationError


IMAGE_FILE_SIZE = 512  # size in kb
ERROR_MSG = f"Max image size should be {IMAGE_FILE_SIZE} kB"


def validate_poster_small_vertical_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    if filesize > 512 * 1024:
        raise ValidationError(f"{ERROR_MSG}. Current Size={(filesize//1024)} kB")
    
class Settings(TimeStampedModel):
    field = models.CharField(max_length=255, null=True, blank=True)
    value = models.TextField(null=True, blank=True)
    toggle_value = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    field_description = models.CharField(max_length=255, null=True, blank=True)
    def __str__(self):
        return self.field
    
class AgeChoices(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.name
    
class LanguageChoices(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name