from rest_framework import serializers

from account.serializers import AccountSerializer
from account.models import Account
from .models import *

# region Media
class MediaAnswerSerializer(serializers.ModelSerializer):
    #TODO:  add detail + create MediaAnswerLightSerializer?
    class Meta:
        model = MediaAnswer
        fields = '__all__'   
            
            
class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = '__all__'   
        
        
class MediaLightSerializer(serializers.ModelSerializer):
    type = MediaTypeSerializer(read_only=True)
    type_w = serializers.PrimaryKeyRelatedField(queryset=MediaType.objects.all(), write_only=True, label='Type')
    
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type','type_w', 'answers'] 
            
            
class MediaSerializer(serializers.ModelSerializer):
    answers = MediaAnswerSerializer(many=True, required=False) # TODO: remove required in the future (angular development)
    type = MediaTypeSerializer(read_only=True)
    type_w = serializers.PrimaryKeyRelatedField(queryset=MediaType.objects.all(), write_only=True, label='Type')
    
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type','type_w', 'answers'] 
# endregion

# region Theme
class ThemeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeCategory
        fields = '__all__'     
    
            
class ThemeLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ['id', 'name']
   
   
class ThemeSerializer(serializers.ModelSerializer):
    category = ThemeCategorySerializer(read_only=True)
    themeCategory = serializers.PrimaryKeyRelatedField(queryset=ThemeCategory.objects.all(), write_only=True, label='Category')
    
    class Meta:
        model = Theme
        fields = ['id', 'name', 'category', 'themeCategory']
# endregion

# region Type
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'   
# endregion  

# region Minigame + MinigameUserNote   
class MinigameExtraLightSerializer(serializers.ModelSerializer):
    theme = ThemeLightSerializer(read_only=True)
    type = TypeSerializer(read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme']


class MinigameUserNoteLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = MinigameUserNote
        fields = ['id', 'note']
        
        
class MinigameUserNoteSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True, source='account.user')
    account_w = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
    
    minigame = MinigameExtraLightSerializer(read_only=True)
    minigame_w = serializers.PrimaryKeyRelatedField(queryset=Minigame.objects.all(), write_only=True)
    
    class Meta:
        model = MinigameUserNote
        fields = ['id', 'minigame', 'minigame_w', 'account', 'account_w', 'note']
            
  
class MinigameLightSerializer(serializers.ModelSerializer):
    theme = ThemeLightSerializer(read_only=True)
    type = TypeSerializer(read_only=True)
    
    notes = MinigameUserNoteLightSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme','cover_url', 'notes', 'date_created', 'date_updated']
        
                  
class MinigameSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)
    theme_w = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), write_only=True, label='Theme')
    type = TypeSerializer(read_only=True)
    type_w = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), write_only=True, label='Type')
    medias = MediaSerializer(many=True, read_only=True)
    medias_w = serializers.PrimaryKeyRelatedField(queryset=Media.objects.all(), many=True, write_only=True, label='Medias')
    
    notes = MinigameUserNoteSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme', 'theme_w', 'type_w', 'medias', 'medias_w','cover_url', 'notes', 'date_created', 'date_updated']
# endregion