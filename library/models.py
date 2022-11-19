from django.db import models
from model_utils.models import TimeStampedModel
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from settings.models import AgeChoices, LanguageChoices
from django.core.exceptions import ValidationError
from . import utils

BANNER_DEFAULT = "Banner Default"
BANNER_WELCOME = "Banner Welcome"
BANNER_CHOICES = [
    (BANNER_DEFAULT, "Banner Default"),
    (BANNER_WELCOME, "Banner Welcome"),
]

IMAGE_FILE_SIZE = 512  # size in kb
ERROR_MSG = f"Max image size should be {IMAGE_FILE_SIZE} kB"


def validate_poster_small_vertical_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    if filesize > 512 * 1024:
        raise ValidationError(f"{ERROR_MSG}. Current Size={(filesize//1024)} kB")


def validate_poster_large_vertical_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    if filesize > 512 * 1024:
        raise ValidationError(f"{ERROR_MSG}. Current Size={(filesize//1024)} kB")


def validate_poster_small_horizontal_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    if filesize > 512 * 1024:
        raise ValidationError(f"{ERROR_MSG}. Current Size={(filesize//1024)} kB")


def validate_poster_large_horizontal_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    if filesize > 512 * 1024:
        raise ValidationError(f"{ERROR_MSG}. Current Size={(filesize//1024)} kB")


class Category(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    rankings = models.PositiveIntegerField(default=1)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ExtrasCategory(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Geners(TimeStampedModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Banner(TimeStampedModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()
    banner_type = models.CharField(
        max_length=25,
        choices=BANNER_CHOICES,
        default=BANNER_DEFAULT,
    )
    url = models.CharField(max_length=255, null=True, blank=True)
    published = models.BooleanField(default=False)


class Movies(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    poster_small_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_large_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_small_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_horizontal_image],
        help_text=ERROR_MSG,
    )
    poster_large_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_horizontal_image],
        help_text=ERROR_MSG,
    )
    duration = models.CharField(max_length=15, null=True, blank=True)
    language = models.ForeignKey(LanguageChoices, null=True, on_delete=models.SET_NULL)
    age_rating = models.ForeignKey(AgeChoices, null=True, on_delete=models.SET_NULL)
    video_link = models.CharField(max_length=255, null=True, blank=True)
    director_name = models.CharField(max_length=255, null=True, blank=True)
    star_cast = models.CharField(max_length=255, null=True, blank=True)
    trailer_link = models.CharField(max_length=255, null=True, blank=True)
    genres = models.ManyToManyField(Geners)
    published = models.BooleanField(default=False)
    membership_requried = models.BooleanField(default=True)
    show_banner = GenericRelation(Banner)

    def __str__(self):
        return self.name


class Series(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    poster_small_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_large_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_small_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_horizontal_image],
        help_text=ERROR_MSG,
    )
    poster_large_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_horizontal_image],
        help_text=ERROR_MSG,
    )
    language = models.ForeignKey(LanguageChoices, null=True, on_delete=models.SET_NULL)
    age_rating = models.ForeignKey(AgeChoices, null=True, on_delete=models.SET_NULL)
    director_name = models.CharField(max_length=255, null=True, blank=True)
    star_cast = models.CharField(max_length=255, null=True, blank=True)
    trailer_link = models.CharField(max_length=255, null=True, blank=True)
    genres = models.ManyToManyField(Geners)
    published = models.BooleanField(default=False)
    show_banner = GenericRelation(Banner)

    def __str__(self):
        return self.name


class Episodes(TimeStampedModel):
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    episode_number = models.PositiveIntegerField()
    poster_small_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_large_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_small_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_horizontal_image],
        help_text=ERROR_MSG,
    )
    poster_large_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_horizontal_image],
        help_text=ERROR_MSG,
    )
    duration = models.CharField(max_length=15, null=True, blank=True)
    membership_requried = models.BooleanField(default=True)
    video_link = models.CharField(max_length=255, null=True, blank=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class CategoryMovieSeriesMapping(TimeStampedModel):
    movies = models.ForeignKey(Movies, null=True, blank=True, on_delete=models.CASCADE)
    series = models.ForeignKey(Series, null=True, blank=True, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    rankings = models.PositiveIntegerField(default=1)

    def clean(self):
        if self.movies and self.series:
            raise ValidationError("Either choose Movies or Series. Cannot select both.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super(CategoryMovieSeriesMapping, self).save(*args, **kwargs)

    def __str__(self):
        obj = self.movies if self.movies else self.series
        return f"{self.category.name}|{obj.name}|{self.rankings}"


class Extras(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    poster_small_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_large_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_small_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_horizontal_image],
        help_text=ERROR_MSG,
    )
    poster_large_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_horizontal_image],
        help_text=ERROR_MSG,
    )
    duration = models.CharField(max_length=15, null=True, blank=True)
    language = models.ForeignKey(LanguageChoices, null=True, on_delete=models.SET_NULL)
    age_rating = models.ForeignKey(AgeChoices, null=True, on_delete=models.SET_NULL)
    video_link = models.CharField(max_length=255, null=True, blank=True)
    trailer_link = models.CharField(max_length=255, null=True, blank=True)
    genres = models.ManyToManyField(Geners)
    published = models.BooleanField(default=False)
    membership_requried = models.BooleanField(default=True)
    extras_category = models.ForeignKey(
        ExtrasCategory, null=True, on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.name


class Upcoming(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    poster_small_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_large_vertical_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_vertical_image],
        help_text=ERROR_MSG,
    )
    poster_small_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_horizontal_image],
        help_text=ERROR_MSG,
    )
    poster_large_horizontal_image = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_large_horizontal_image],
        help_text=ERROR_MSG,
    )
    duration = models.CharField(max_length=15, null=True, blank=True)
    release_date_time = models.DateTimeField(null=True, blank=True)
    coming_soon_flag = models.BooleanField(default=False)
    show_trailer_flag = models.BooleanField(default=False)
    language = models.ForeignKey(LanguageChoices, null=True, on_delete=models.SET_NULL)
    age_rating = models.ForeignKey(AgeChoices, null=True, on_delete=models.SET_NULL)
    director_name = models.CharField(max_length=255, null=True, blank=True)
    star_cast = models.CharField(max_length=255, null=True, blank=True)
    trailer_link = models.CharField(max_length=255, null=True, blank=True)
    genres = models.ManyToManyField(Geners)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class NewsLetterSubscription(TimeStampedModel):
    email = models.EmailField(max_length=255, null=True, blank=True)
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return self.email
