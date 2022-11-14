# from django.db import models
# from model_utils.models import TimeStampedModel

# # Create your models here.
# class Movies(TimeStampedModel):
#     name = models.CharField(max_length=255, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
#     poster_vertical = models.CharField(max_length=255, null=True, blank=True)
#     poster_horizontal = models.CharField(max_length=255, null=True, blank=True)
#     poster_large = models.CharField(max_length=255, null=True, blank=True)
#     poster_medium = models.CharField(max_length=255, null=True, blank=True)
#     poster_small = models.CharField(max_length=255, null=True, blank=True)
#     duration = models.CharField(max_length=255, null=True, blank=True)
#     language = models.CharField(max_length=255, null=True, blank=True) # langugage options check whatsapp
#     age_rating = models.CharField(max_length=255, null=True, blank=True) # dropdown check whatsapp
#     video_link = models.CharField(max_length=255, null=True, blank=True)
#     director_name = models.CharField(max_length=255, null=True, blank=True)
#     star_cast = models.CharField(max_length=255, null=True, blank=True)
#     trailer_link = models.CharField(max_length=255, null=True, blank=True)
#     genres = models.CharField(max_length=255, null=True, blank=True) #list required
#     published = models.CharField(max_length=255, null=True, blank=True) #list required
#     category  = models.CharField(max_length=255, null=True, blank=True) #list required
    
# class Series(TimeStampedModel):
#     name = models.CharField(max_length=255, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
#     poster_vertical = models.CharField(max_length=255, null=True, blank=True)
#     poster_horizontal = models.CharField(max_length=255, null=True, blank=True)
#     poster_large = models.CharField(max_length=255, null=True, blank=True)
#     poster_medium = models.CharField(max_length=255, null=True, blank=True)
#     poster_small = models.CharField(max_length=255, null=True, blank=True)
#     duration = models.CharField(max_length=255, null=True, blank=True)
#     language = models.CharField(max_length=255, null=True, blank=True) # langugage options check whatsapp
#     age_rating = models.CharField(max_length=255, null=True, blank=True) # dropdown check whatsapp
#     director_name = models.CharField(max_length=255, null=True, blank=True)
#     star_cast = models.CharField(max_length=255, null=True, blank=True)
#     trailer_link = models.CharField(max_length=255, null=True, blank=True)
#     genres = models.CharField(max_length=255, null=True, blank=True) #list required
#     published = models.CharField(max_length=255, null=True, blank=True) #list required
    
# class Episodes(TimeStampedModel):
#     series = models.ForeignKey(Series, on_delete=models.CASCADE)
#     season = models.PositiveIntegerField()
#     episode_number = models.PositiveIntegerField()
#     duration = models.CharField(max_length=255, null=True, blank=True)
#     name = models.CharField(max_length=255, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
#     poster_large = models.CharField(max_length=255, null=True, blank=True)
#     poster_medium = models.CharField(max_length=255, null=True, blank=True)
#     poster_small = models.CharField(max_length=255, null=True, blank=True)
#     video_link = models.CharField(max_length=255, null=True, blank=True)
#     published = models.CharField(max_length=255, null=True, blank=True)

# class Extras(TimeStampedModel):
#     name = models.CharField(max_length=255, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
#     poster_vertical = models.CharField(max_length=255, null=True, blank=True)
#     poster_horizontal = models.CharField(max_length=255, null=True, blank=True)
#     poster_large = models.CharField(max_length=255, null=True, blank=True)
#     poster_medium = models.CharField(max_length=255, null=True, blank=True)
#     poster_small = models.CharField(max_length=255, null=True, blank=True)
#     duration = models.CharField(max_length=255, null=True, blank=True)
#     language = models.CharField(max_length=255, null=True, blank=True) # langugage options check whatsapp
#     age_rating = models.CharField(max_length=255, null=True, blank=True) # dropdown check whatsapp
#     video_link = models.CharField(max_length=255, null=True, blank=True)
#     published = models.CharField(max_length=255, null=True, blank=True) #list required
#     extras_category  = models.CharField(max_length=255, null=True, blank=True) #custom
    
# class Upcoming(TimeStampedModel):
#     name = models.CharField(max_length=255)
#     description = models.CharField
#     poster_vertical = models.CharField(max_length=255, null=True, blank=True)
#     poster_horizontal = models.CharField(max_length=255, null=True, blank=True)
#     poster_large = models.CharField(max_length=255, null=True, blank=True)
#     poster_medium = models.CharField(max_length=255, null=True, blank=True)
#     poster_small = models.CharField(max_length=255, null=True, blank=True)
#     release_date_time= models.CharField(max_length=255, null=True, blank=True) #optional
#     coming_soon_= models.CharField(max_length=255, null=True, blank=True)
#     language = models.CharField(max_length=255, null=True, blank=True)
#     published = models.CharField(max_length=255, null=True, blank=True)
#     age_rating = models.CharField(max_length=255, null=True, blank=True) # dropdown check whatsapp
#     director_name = models.CharField(max_length=255, null=True, blank=True)
#     star_cast = models.CharField(max_length=255, null=True, blank=True)
#     trailer_link = models.CharField(max_length=255, null=True, blank=True) #optional
#     show_trailer = boolean field
#     genres = models.CharField(max_length=255, null=True, blank=True) #list required
    
# class Category(TimeStampedModel):
#     name = models.CharField(max_length=255, null=True, blank=True)
#     poster_type = models.CharField(max_length=255, null=True, blank=True) #horizontal / vertical / small(poster_small) => small vertial/ large vertical small horizontal/ large horizontal
#     published =
    
# class Banner(TimeStampedModel):
#     movie/tv_show 
#     url #can be external
#     publish
#     #on click send it to movie/ tv show
    
# class WelcomeBanner(TimeStampedModel):
#     movie/tv_show 
#     url #can be external
#     publish
#     #on click send it to movie/ tv show
    
# #continue watching and video should start from there
# #mylist
# #more like this