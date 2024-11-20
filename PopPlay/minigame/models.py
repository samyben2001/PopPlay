from django.db import models
from django.core.files.storage import storages
from django.core.validators import MaxValueValidator, MinValueValidator

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
    name = models.CharField(max_length=200)
    url = models.FileField(unique=True, storage=storages["cloudflare"], null=True, blank=True)
    type = models.ForeignKey(MediaType, on_delete=models.DO_NOTHING)
    answers = models.ManyToManyField(Answer)
    
    def __str__(self):
        return self.name

# TODO: implement create mapGuess serializer/views
class MapGuess(models.Model):
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
    
    def __str__(self):
        return self.question.question
 
class ThemeCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
       
    
class Theme(models.Model):
    name = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(ThemeCategory, on_delete=models.RESTRICT)
    
    def __str__(self):
        return self.name
    
  
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
    medias = models.ManyToManyField(Media)
    quizz = models.ManyToManyField(Quiz)
    maps = models.ManyToManyField(MapGuess)
    notes = models.ManyToManyField('account.Account', through='MinigameUserNote')
    
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
