from rest_framework import serializers
from .models import *

#TODO: CRUD for minigames
class ThemeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeCategory
        fields = '__all__'     
            
            
class ThemeSerializer(serializers.ModelSerializer):
    category = ThemeCategorySerializer(read_only=True)
    themeCategory = serializers.PrimaryKeyRelatedField(queryset=ThemeCategory.objects.all(), write_only=True, label='Category')
    class Meta:
        model = Theme
        fields = ['name', 'category', 'themeCategory']
            
            
class MediaAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAnswer
        fields = '__all__'   
            
            
class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = '__all__'   
            
            
class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'   


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'   
            
            
class MinigameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Minigame
        fields = '__all__'
