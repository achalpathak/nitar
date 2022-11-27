from django.db import models
from model_utils.models import TimeStampedModel
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from settings.models import AgeChoices, LanguageChoices
from django.core.exceptions import ValidationError
from . import utils
from django.dispatch import receiver
from django.db.models import signals

BANNER_DEFAULT = "Banner Default"
POSTER_DEFAULT = "poster_small_vertical_image"
POSTER_CHOICES = [
    (POSTER_DEFAULT, "poster_small_vertical_image"),
    ("poster_large_vertical_image", "poster_large_vertical_image"),
    ("poster_small_horizontal_image", "poster_small_horizontal_image"),
    ("poster_large_horizontal_image", "poster_large_horizontal_image"),
]
BANNER_WELCOME = "Banner Welcome"
BANNER_CHOICES = [
    (BANNER_DEFAULT, "Banner Default"),
    (BANNER_WELCOME, "Banner Welcome"),
]
URL_DEFAULT = "EXTERNAL"
URL_CHOICES = [
    ("INTERNAL", "INTERNAL"),
    (URL_DEFAULT, "EXTERNAL"),
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
    poster_type = models.CharField(
        max_length=50,
        choices=POSTER_CHOICES,
        default=POSTER_DEFAULT,
    )
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

    class Meta:
        verbose_name_plural = "Geners"


class Banner(TimeStampedModel):
    website_banner = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    mobile_banner = models.ImageField(
        upload_to=utils.image_path,
        null=True,
        blank=True,
        validators=[validate_poster_small_vertical_image],
        help_text=ERROR_MSG,
    )
    banner_type = models.CharField(
        max_length=25,
        choices=BANNER_CHOICES,
        default=BANNER_DEFAULT,
    )
    url = models.CharField(
        max_length=255,
        help_text="NOTE: Enter SLUG value if url is internal.",
    )
    url_type = models.CharField(
        max_length=25,
        choices=URL_CHOICES,
        default=URL_DEFAULT,
    )
    published = models.BooleanField(default=True)


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
    slug = models.SlugField(null=True, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Movies"


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
    slug = models.SlugField(null=True, unique=True)
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
    slug = models.SlugField(null=True, unique=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.series.name} | {self.name} | Episode No={self.episode_number}"

    class Meta:
        verbose_name_plural = "Episodes"


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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["movies", "category"], name="movie category unique"
            ),
            models.UniqueConstraint(
                fields=["series", "category"], name="series category unique"
            ),
        ]

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
    slug = models.SlugField(null=True, unique=True)
    extras_category = models.ForeignKey(
        ExtrasCategory, null=True, on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Extras"


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
    slug = models.SlugField(null=True, unique=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class NewsLetterSubscription(TimeStampedModel):
    email = models.EmailField(max_length=255, null=True, blank=True)
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return self.email


@receiver(signals.pre_save, sender=Movies)
def populate_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = utils.unique_slug_generator(instance)


@receiver(signals.pre_save, sender=Series)
def populate_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = utils.unique_slug_generator(instance)


@receiver(signals.pre_save, sender=Extras)
def populate_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = utils.unique_slug_generator(instance)


@receiver(signals.pre_save, sender=Episodes)
def populate_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = utils.unique_slug_generator(instance, episodes=True)


@receiver(signals.pre_save, sender=Upcoming)
def populate_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = utils.unique_slug_generator(instance)
