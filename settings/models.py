from django.db import models
from model_utils.models import TimeStampedModel

# Create your models here.
class Settings(TimeStampedModel):
    field = models.CharField(max_length=255, null=True, blank=True)
    value = models.TextField(null=True, blank=True)
    toggle_value = models.BooleanField(default=False)
    
    def __str__(self):
        return self.field