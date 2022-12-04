from django.core.management.base import BaseCommand
from django.utils import timezone
import random


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        from library.models import (
            Movies,
            Series,
            Episodes,
            CategoryMovieSeriesMapping,
            Category,
            Upcoming,
            Geners,
        )
        from settings.models import LanguageChoices, AgeChoices
        import urllib.request
        from django.core.files import File
        from django.utils import timezone
        from datetime import timedelta
        hls_link="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

        language_obj = LanguageChoices.objects.all().first()
        age_obj = AgeChoices.objects.all().first()
        geners_obj = list(Geners.objects.all().values_list("id", flat=True))
        category_obj = list(Category.objects.all().values_list("id", flat=True))
        die_hard_poster_vertical_small_url = urllib.request.urlretrieve(
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Xv7VNH9UlDWMAoELqFmwELDYYiyEdi0phtGN_aJUd1WB91QluQhOhHPBxECU1OLIoPg&usqp=CAU"
        )
        die_hard_poster_vertical_large_url = urllib.request.urlretrieve(
            "https://m.media-amazon.com/images/M/MV5BNDQxMDE1OTg4NV5BMl5BanBnXkFtZTcwMTMzOTQzMw@@._V1_.jpg"
        )
        die_hard_poster_horizontal_small_url = urllib.request.urlretrieve(
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77jN7_ZRji5Li9DLtmz-bCpi1x_Y4Ir-f3w&usqp=CAU"
        )
        die_hard_poster_horizontal_large_url = urllib.request.urlretrieve(
            "https://m.media-amazon.com/images/M/MV5BMDkwNzhjYjktNzMwMC00ZDQ0LThmNTYtODNiOTY5NGQ1YzdjXkEyXkFqcGdeQXVyOTc5MDI5NjE@._V1_.jpg"
        )
        print("[x] Adding Movies....")
        movies_objs = Movies.objects.bulk_create(
            [
                Movies(
                    name="Hot Wheels",
                    description="cool car movie",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    video_link=hls_link,
                    published=True,
                    membership_required=True,
                    slug="hot-wheels",
                ),
                Movies(
                    name="Die Hard",
                    description="super good movie",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    video_link=hls_link,
                    published=True,
                    membership_required=True,
                    slug="die-hard",
                ),
                Movies(
                    name="Avengers",
                    description="marvel fan",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    video_link=hls_link,
                    published=True,
                    membership_required=False,
                    slug="avengers",
                ),
            ]
        )
        for obj in movies_objs:
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))
        print("     [-] Adding Category Mapping....")
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[0], movies=movies_objs[0], rankings=1
        )
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[0], movies=movies_objs[1], rankings=2
        )
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[2], movies=movies_objs[2], rankings=1
        )

        print("[x] Adding Upcoming....")
        upcoming_objs = Upcoming.objects.bulk_create(
            [
                Upcoming(
                    name="SpiderMan3",
                    description="cool",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    release_date_time=timezone.now() + timedelta(days=5),
                    coming_soon_flag=True,
                    show_trailer_flag=True,
                    published=True,
                ),
                Upcoming(
                    name="Doctor strange",
                    description="super good movie",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    release_date_time=timezone.now() + timedelta(days=15),
                    coming_soon_flag=True,
                    show_trailer_flag=False,
                    published=True,
                ),
                Upcoming(
                    name="Black Panther",
                    description="marvel fan",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    release_date_time=timezone.now() + timedelta(days=12),
                    coming_soon_flag=False,
                    show_trailer_flag=True,
                    published=True,
                ),
            ]
        )
        for obj in upcoming_objs:
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))

        print("[x] Adding Series....")
        series_obj = Series.objects.bulk_create(
            [
                Series(
                    name="Breaking Bad",
                    description="",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    published=True,
                ),
                Series(
                    name="Prison Break",
                    description="",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    published=True,
                ),
                Series(
                    name="Suits",
                    description="",
                    language=language_obj,
                    age_rating=age_obj,
                    poster_small_vertical_image=File(
                        open(die_hard_poster_vertical_small_url[0], "rb")
                    ),
                    poster_large_vertical_image=File(
                        open(die_hard_poster_vertical_large_url[0], "rb")
                    ),
                    poster_small_horizontal_image=File(
                        open(die_hard_poster_horizontal_small_url[0], "rb")
                    ),
                    poster_large_horizontal_image=File(
                        open(die_hard_poster_horizontal_large_url[0], "rb")
                    ),
                    trailer_link=hls_link,
                    published=True,
                ),
            ]
        )
        print("     [-] Adding Category Mapping....")
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[0], series=series_obj[0], rankings=1
        )
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[1], series=series_obj[1], rankings=1
        )
        CategoryMovieSeriesMapping.objects.create(
            category_id=category_obj[1], series=series_obj[2], rankings=2
        )

        print("[x] Adding Episodes....")
        for obj in series_obj:
            episode_obj = Episodes.objects.bulk_create(
                [
                    Episodes(
                        series=obj,
                        name="Pilot episode",
                        episode_number=1,
                        description="",
                        published=True,
                        poster_small_vertical_image=File(
                            open(die_hard_poster_vertical_small_url[0], "rb")
                        ),
                        poster_large_vertical_image=File(
                            open(die_hard_poster_vertical_large_url[0], "rb")
                        ),
                        poster_small_horizontal_image=File(
                            open(die_hard_poster_horizontal_small_url[0], "rb")
                        ),
                        poster_large_horizontal_image=File(
                            open(die_hard_poster_horizontal_large_url[0], "rb")
                        ),
                        video_link=hls_link,
                        membership_required=False,
                    ),
                    Episodes(
                        series=obj,
                        name="Second Episode",
                        episode_number=2,
                        description="",
                        published=True,
                        poster_small_vertical_image=File(
                            open(die_hard_poster_vertical_small_url[0], "rb")
                        ),
                        poster_large_vertical_image=File(
                            open(die_hard_poster_vertical_large_url[0], "rb")
                        ),
                        poster_small_horizontal_image=File(
                            open(die_hard_poster_horizontal_small_url[0], "rb")
                        ),
                        poster_large_horizontal_image=File(
                            open(die_hard_poster_horizontal_large_url[0], "rb")
                        ),
                        video_link=hls_link,
                        membership_required=True,
                    ),
                    Episodes(
                        series=obj,
                        name="Third Episode",
                        episode_number=3,
                        description="",
                        published=True,
                        poster_small_vertical_image=File(
                            open(die_hard_poster_vertical_small_url[0], "rb")
                        ),
                        poster_large_vertical_image=File(
                            open(die_hard_poster_vertical_large_url[0], "rb")
                        ),
                        poster_small_horizontal_image=File(
                            open(die_hard_poster_horizontal_small_url[0], "rb")
                        ),
                        poster_large_horizontal_image=File(
                            open(die_hard_poster_horizontal_large_url[0], "rb")
                        ),
                        video_link=hls_link,
                        membership_required=True,
                    ),
                ]
            )
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))
            obj.genres.add(random.choice(geners_obj))

        print("[x] Done....")
