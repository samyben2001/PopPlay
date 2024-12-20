from django.db import models
from django.contrib.auth.models import User

from minigame.models import Media, Theme
from minigame.models import Minigame

# TODO: mail in user model should be unique: heritage de AbstractUser? + add username minlength(3) + get by username

# Create your models here.
class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    games_liked = models.ManyToManyField(Minigame, related_name='liked_by')
    themes_liked = models.ManyToManyField(Theme)
    games_score = models.ManyToManyField(Minigame, through='UserMinigameScore', related_name='scored_by')
    
    def __str__(self):
        return self.user.username
    
class UserMinigameScore(models.Model):
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    minigame = models.ForeignKey(Minigame, on_delete=models.CASCADE)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)