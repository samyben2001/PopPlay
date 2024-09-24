from rest_framework import serializers
from .models import *

#TODO: make differents serializers for list or detail

class ThemeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeCategory
        fields = '__all__'     
            
            
class ThemeSerializer(serializers.ModelSerializer):
    category = ThemeCategorySerializer(read_only=True)
    themeCategory = serializers.PrimaryKeyRelatedField(queryset=ThemeCategory.objects.all(), write_only=True, label='Category')
    class Meta:
        model = Theme
        fields = ['id', 'name', 'category', 'themeCategory']
            
            
class MediaAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAnswer
        fields = '__all__'   
            
            
class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = '__all__'   
            
            
class MediaSerializer(serializers.ModelSerializer):
    answers = MediaAnswerSerializer(many=True, required=False)
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type', 'answers'] 


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'   

        
class MinigameUserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MinigameUserNote
        fields = '__all__'
            
class MinigameSerializer(serializers.ModelSerializer):
    
    theme = ThemeSerializer(read_only=True)
    theme_w = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), write_only=True, label='Theme')
    type = ThemeSerializer(read_only=True)
    type_w = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), write_only=True, label='Type')
    # notes = MinigameUserNoteSerializer()
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme', 'theme_w', 'type_w', 'medias','cover_url', 'notes', 'date_created', 'date_updated']
        

