from rest_framework import serializers

from account.models import Account
from .models import *

# region Media
class MediaAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAnswer
        fields = '__all__'   
            
            
class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = '__all__'   
        
        
class MediaLightSerializer(serializers.ModelSerializer):
    type = MediaTypeSerializer(read_only=True)
    
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type'] 
            
            
class MediaSerializer(serializers.ModelSerializer):
    answers = MediaAnswerSerializer(many=True, read_only=True)
    answers_id = serializers.PrimaryKeyRelatedField(queryset=MediaAnswer.objects.all(), many=True, write_only=True, source='answers', label='Answers')
    type = MediaTypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=MediaType.objects.all(), write_only=True, source='type', label='Type')
    
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type','type_id', 'answers', 'answers_id'] 
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
    category_id = serializers.PrimaryKeyRelatedField(queryset=ThemeCategory.objects.all(), write_only=True, source='category', label='Category')
    
    class Meta:
        model = Theme
        fields = ['id', 'name', 'category', 'category_id']
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
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True, label='Account')
    
    class Meta:
        model = MinigameUserNote
        fields = ['account', 'minigame', 'note']
        
            
  
class MinigameLightSerializer(serializers.ModelSerializer):
    theme = ThemeLightSerializer(read_only=True)
    type = TypeSerializer(read_only=True)
    
    notes = MinigameUserNoteLightSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme','cover_url', 'notes', 'date_created', 'date_updated']
        
                  
class MinigameSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), write_only=True, source='theme', label='Theme')
    type = TypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), write_only=True, source='type', label='Type')
    medias = MediaSerializer(many=True, read_only=True)
    medias_id = serializers.PrimaryKeyRelatedField(queryset=Media.objects.all(), many=True, write_only=True, source='medias', label='Medias')
    
    notes = MinigameUserNoteSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme', 'theme_id', 'type_id', 'medias', 'medias_id','cover_url', 'notes', 'date_created', 'date_updated']
# endregion