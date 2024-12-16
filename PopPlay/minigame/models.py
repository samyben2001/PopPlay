from django.db import models
from django.core.files.storage import storages
from django.core.validators import MaxValueValidator, MinValueValidator
import os
from django.utils.text import slugify


class MinigameReportType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name


class MinigameReport(models.Model):
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING)
    minigame = models.ForeignKey('minigame.Minigame', on_delete=models.DO_NOTHING)
    reportType = models.ForeignKey(MinigameReportType, on_delete=models.DO_NOTHING)
    isActive = models.BooleanField(default=True)
    message = models.TextField(blank=True, null=True)
    
    
class MediaQuizReportType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name


class MediaQuizReport(models.Model):
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING)
    media = models.ForeignKey('minigame.Media', on_delete=models.DO_NOTHING, blank=True, null=True)
    quiz = models.ForeignKey('minigame.Quiz', on_delete=models.DO_NOTHING, blank=True, null=True)
    reportType = models.ForeignKey(MediaQuizReportType, on_delete=models.DO_NOTHING)
    isActive = models.BooleanField(default=True)
    message = models.TextField(blank=True, null=True)


# Create your models here.    
class Answer(models.Model):
    answer = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.answer
    
    
class MediaType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
    
class Media(models.Model):
    # TODO: add question 
    name = models.CharField(max_length=200)
    url = models.FileField(unique=True, storage=storages["cloudflare"], null=True, blank=True)
    type = models.ForeignKey(MediaType, on_delete=models.DO_NOTHING)
    answers = models.ManyToManyField(Answer)
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING, blank=True, null=True, related_name='medias')
    reports = models.ManyToManyField('account.Account', blank=True, through='MediaQuizReport', related_name='mediaReports')
    
    def save(self, *args, **kwargs):
        """
        Saves the Media instance, ensuring that the file name of the URL is generated 
        based on the slugified version of the 'name' field for safe storage. The file 
        extension is preserved in the new file name. Calls the superclass save method 
        with any additional arguments passed.
        """
        if self.url and self.name:
            # Generate a new file name based on the name field
            ext = os.path.splitext(self.url.name)[1]  # Get the file extension
            new_filename = f"{slugify(self.name)}{ext}"  # Slugify the name for a safe filename TODO: add type + account id
            self.url.name = new_filename
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

# TODO: thinking about a better way to do this
class MapGuess(models.Model): # 1# find the game with an unblur image (media), #2 find where the image was taken on the map (cf lostgamer.io)
    media = models.ForeignKey(Media, on_delete=models.DO_NOTHING)
    map = models.FileField(storage=storages["cloudflare"]) 
    positionX = models.IntegerField()
    positionY = models.IntegerField()
    
    def __str__(self):
        return self.name
    
    
class Question(models.Model): 
    question = models.CharField(unique=True)
    
    def __str__(self):
        return self.question


class Quiz(models.Model):
    question = models.ForeignKey(Question, on_delete=models.DO_NOTHING)
    answers = models.ManyToManyField(Answer)
    reports = models.ManyToManyField('account.Account', blank=True, through='MediaQuizReport', related_name='quizReports')
    
    def __str__(self):
        return self.question.question
 
class ThemeCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
       
    
class Theme(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(ThemeCategory, on_delete=models.RESTRICT)
    
    def __str__(self):
        return self.name
    
    class Meta:
        unique_together = ('name', 'category')
    
  
class Type(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
    
      
class Minigame(models.Model):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    cover_url = models.FileField(storage=storages["cloudflare"], blank=True)
    author = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING, related_name='minigames')
    theme = models.ForeignKey(Theme, on_delete=models.DO_NOTHING)
    type = models.ForeignKey(Type, on_delete=models.DO_NOTHING)
    # TODO: add medias = models.ManyToManyField(Media, through='MinigameMedia')
    medias = models.ManyToManyField(Media)
    quizz = models.ManyToManyField(Quiz)
    maps = models.ManyToManyField(MapGuess)
    notes = models.ManyToManyField('account.Account', through='MinigameUserNote')
    reports = models.ManyToManyField('account.Account', blank=True, through='MinigameReport', related_name='reports')
    
    def __str__(self):
        return self.name
    
    
    class Meta:
        unique_together = ('name', 'type')
    

class MinigameUserNote(models.Model):
    account = models.ForeignKey('account.Account', on_delete=models.DO_NOTHING, related_name='minigames_notes')
    minigame = models.ForeignKey(Minigame, on_delete=models.DO_NOTHING, related_name='minigame_notes')
    note = models.IntegerField(validators=[
        MinValueValidator(0, message="Note must be between 0 and 5"),
        MaxValueValidator(5, message="Note must be between 0 and 5")
        ])
