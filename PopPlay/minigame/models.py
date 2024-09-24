from django.db import models
from django.core.files.storage import storages
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.    
class MediaAnswer(models.Model):
    answer = models.CharField(max_length=200, unique=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.answer
    
    
class MediaType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
    
       
class Media(models.Model):
    name = models.CharField(max_length=200)
    url = models.FileField(unique=True, storage=storages["cloudflare"])
    type = models.ForeignKey(MediaType, on_delete=models.DO_NOTHING)
    answers = models.ManyToManyField(MediaAnswer)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
 
 
class ThemeCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
       
    
class Theme(models.Model):
    name = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(ThemeCategory, on_delete=models.RESTRICT)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
    
  
class Type(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
    
      
class Minigame(models.Model):
    name = models.CharField(max_length=200, unique=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    cover_url = models.FileField(null=True, blank=True, storage=storages["cloudflare"])
    
    theme = models.ForeignKey(Theme, on_delete=models.DO_NOTHING)
    type = models.ForeignKey(Type, on_delete=models.DO_NOTHING)
    medias = models.ManyToManyField(Media)
    notes = models.ManyToManyField('account.Account', through='MinigameUserNote')
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.name
    
    
    
class MinigameUserNote(models.Model):
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING, related_name='minigames_notes')
    minigame = models.ForeignKey(Minigame, on_delete=models.DO_NOTHING, related_name='minigame_notes')
    note = models.IntegerField(validators=[
        MinValueValidator(0, message="Note must be between 0 and 5"),
        MaxValueValidator(5, message="Note must be between 0 and 5")
        ])
    
    class Meta:
        ordering = ['id']
