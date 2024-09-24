from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.    
class MediaAnswer(models.Model):
    answer = models.CharField(max_length=200, unique=True)
    
    
class MediaType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
       
class Media(models.Model):
    name = models.CharField(max_length=200)
    url = models.URLField(unique=True)
    type = models.ForeignKey(MediaType, on_delete=models.DO_NOTHING)
    answers = models.ManyToManyField(MediaAnswer)
 
 
class ThemeCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
       
    
class Theme(models.Model):
    name = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(ThemeCategory, on_delete=models.RESTRICT)
    
  
class Type(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
      
class Minigame(models.Model):
    name = models.CharField(max_length=200, unique=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    cover_url = models.URLField(null=True, blank=True)
    
    theme = models.ForeignKey(Theme, on_delete=models.DO_NOTHING)
    type = models.ForeignKey(Type, on_delete=models.DO_NOTHING)
    medias = models.ManyToManyField(Media)
    notes = models.ManyToManyField('account.Account', through='MinigameUserNote')
    
    
class MinigameUserNote(models.Model):
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING)
    minigame = models.ForeignKey(Minigame, on_delete=models.DO_NOTHING)
    note = models.IntegerField(validators=[
        MinValueValidator(0, message="Note must be between 0 and 5"),
        MaxValueValidator(5, message="Note must be between 0 and 5")
        ])