from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Account, UserMinigameScore
from minigame.models import Minigame, Theme
from minigame.serializers import ThemeLightSerializer, MinigameExtraLightSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']

    def validate(self, data):
        """
        Vérifie que les deux mots de passe correspondent.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data
                  
    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])  # Hash le mot de passe
        user.save()
        return user
    
class UserLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
    
    
class AccountLightSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'user']
        
    
class AccountSerializer(serializers.ModelSerializer):
    themes_liked = ThemeLightSerializer(label='Themes', many=True, read_only=True)
    games_liked = MinigameExtraLightSerializer(label='Games', many=True, read_only=True)
    user = UserLightSerializer()
    
    class Meta:
        model = Account
        fields = '__all__'
  
  
class AccountThemeLikedSerializer(serializers.ModelSerializer):
    themes_liked = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), write_only=False, label='Theme', many=False)
    class Meta:
        model = Account
        fields = ['themes_liked']
 
 
class AccountMinigameLikedSerializer(serializers.ModelSerializer):
    games_liked = serializers.PrimaryKeyRelatedField(queryset=Minigame.objects.all(), write_only=False, label='Game')
    games = MinigameExtraLightSerializer(read_only=True, source='games_liked')
    class Meta:
        model = Account
        fields = ['games_liked', 'games']
        
class AccountMinigameScoreSerializer(serializers.ModelSerializer):
    minigame = serializers.PrimaryKeyRelatedField(queryset=Minigame.objects.all(), write_only=False, label='Game')
    game = MinigameExtraLightSerializer(read_only=True, source='minigame')
    
    
    class Meta:
        model = UserMinigameScore
        fields = ['minigame', 'game', 'score']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims here
        token['account_id'] = user.account.id

        return token