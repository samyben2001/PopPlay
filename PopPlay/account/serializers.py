from rest_framework import serializers
from django.contrib.auth.models import User

from popplay.paginations import NestedStandardResultsSetPagination

from .models import Account, UserMinigameScore
from minigame.models import Minigame, Theme
from minigame.serializers import MinigameLightSerializer, ThemeLightSerializer, MinigameExtraLightSerializer
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
        fields = ['id', 'username', 'email', 'date_joined', 'is_staff']
    
    
   
class AccountMinigameScoreSerializer(serializers.ModelSerializer):
    minigame = serializers.PrimaryKeyRelatedField(queryset=Minigame.objects.all(), write_only=True, label='Game')
    game = MinigameExtraLightSerializer(source='minigame', read_only=True)
    
    class Meta:
        model = UserMinigameScore
        fields = ['minigame', 'game', 'score', 'date']
        
           
class AccountLightSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'user']
        
    
class AccountSerializer(serializers.ModelSerializer):
    themes_liked = ThemeLightSerializer(label='ThemesLiked', many=True, read_only=True)
    minigames = serializers.SerializerMethodField(label='Minigames')
    games_liked = serializers.SerializerMethodField(label='MinigamesLiked')
    games_score = serializers.SerializerMethodField(label='Scores', read_only=True)
    user = UserLightSerializer()
    
    class Meta:
        model = Account
        fields = '__all__'
        
    def get_games_score(self, instance):
        scores = instance.userminigamescore_set.all().order_by('-date')
        return AccountMinigameScoreSerializer(scores, many=True).data

    def get_minigames(self, instance):
        # Paginate the related minigames
        minigames = instance.minigames.all()
        return self.paginate_queryset(minigames, MinigameLightSerializer, 'minigames')

    def get_games_liked(self, instance):
        # Paginate the related liked minigames
        minigames = instance.games_liked.all()
        return self.paginate_queryset(minigames, MinigameLightSerializer, 'games_liked')

    def paginate_queryset(self, queryset, serializer_class, page_query_param):
        """
        Helper method to paginate a queryset and serialize the results.
        """
        request = self.context.get('request')
        paginator = NestedStandardResultsSetPagination()  # Use custom pagination class
        paginator.page_query_param = page_query_param  # Set a unique query parameter for this field
        # Paginate the queryset using the request object
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        if paginated_queryset is not None:
            # Serialize the paginated data
            serialized_data = serializer_class(paginated_queryset, many=True, context=self.context).data
            # Return the paginated response data
            return paginator.get_paginated_response(serialized_data).data
        # If pagination is not applied, serialize the entire queryset
        return serializer_class(queryset, many=True, context=self.context).data
    
  
class AccountThemeLikedSerializer(serializers.ModelSerializer):
    themes_liked = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), label='Theme', many=False)
    class Meta:
        model = Account
        fields = ['themes_liked']
 
 
class AccountMinigameLikedSerializer(serializers.ModelSerializer):
    games_liked = serializers.PrimaryKeyRelatedField(queryset=Minigame.objects.all(), many=False, write_only=True, label='Game')
    games = MinigameExtraLightSerializer(read_only=True, many=True, source='games_liked')
    class Meta:
        model = Account
        fields = ['games_liked', 'games']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims here
        token['account_id'] = user.account.id

        return token