from rest_framework import serializers

from account.models import Account, UserMinigameScore
from .models import *


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__' 
        
        
# region Media  
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
    answers = AnswerSerializer(many=True, read_only=True)
    answers_id = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True, write_only=True, source='answers', label='Answers')
    type = MediaTypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=MediaType.objects.all(), write_only=True, source='type', label='Type')
    
    class Meta:
        model = Media
        fields = ['id', 'name', 'url', 'type','type_id', 'answers', 'answers_id'] 
        
    def create(self, validated_data):
        accountID = self.context.get('request').user.account
        if accountID is None:
            raise serializers.ValidationError("You must be logged in to create a minigame")
        
        validated_data['account'] = accountID
        return super().create(validated_data)
# endregion

# region Quizz
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        
        
class QuizSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    question_id = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all(), write_only=True, source='question', label='Question')
    answers = AnswerSerializer(many=True, read_only=True)
    answers_id = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True, write_only=True, source='answers', label='Answers')
    
    class Meta:
        model = Quiz
        fields = ['id','question', 'question_id', 'answers' , 'answers_id']
# endregion

# region MapGuess
# TODO: mapguess serializer
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
    
    author = serializers.SerializerMethodField(read_only=True)
    notes = MinigameUserNoteLightSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme','cover_url', 'notes', 'date_created', 'date_updated', 'author']
        
    def get_author(self, obj):
        from account.serializers import AccountLightSerializer # local import to avoid circular import
        return AccountLightSerializer(obj.author).data
        
                  
class MinigameSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), write_only=True, source='theme', label='Theme')
    type = TypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), write_only=True, source='type', label='Type')
    medias = MediaSerializer(many=True, read_only=True)
    medias_id = serializers.PrimaryKeyRelatedField(queryset=Media.objects.all(), many=True, write_only=True, source='medias', label='Medias')
    quizz = QuizSerializer(many=True, read_only=True)
    quizz_id = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.all(), many=True, write_only=True, source='quizz', label='Quizz')
    author = serializers.SerializerMethodField(read_only=True)
    
    notes = MinigameUserNoteSerializer(source='minigame_notes', many=True, read_only=True)
    
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'theme', 'theme_id', 'type_id', 'medias', 'medias_id','quizz', 'quizz_id','cover_url', 'notes', 'date_created', 'date_updated','liked_by', 'author']
        
    def get_author(self, obj):
        from account.serializers import AccountLightSerializer
        return AccountLightSerializer(obj.author).data
        
    def create(self, validated_data):
        accountID = self.context.get('request').user.account
        if accountID is None:
            raise serializers.ValidationError("You must be logged in to create a minigame")
        
        validated_data['author'] = accountID
        return super().create(validated_data)
        
class MinigameLikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Minigame
        fields = ['liked_by']
        

class AccountMinigameScoreSerializer(serializers.ModelSerializer):
    account = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = UserMinigameScore
        fields = ['account', 'score', 'date']
        
    def get_account(self, obj):
        from account.serializers import AccountLightSerializer
        return AccountLightSerializer(obj.account).data
        

class MinigameTopScoresSerializer(serializers.ModelSerializer):
    top_scores = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Minigame
        fields = ['top_scores']
        
    def get_top_scores(self, obj):
        return AccountMinigameScoreSerializer(UserMinigameScore.objects.filter(minigame=obj).order_by('-score')[:10], many=True).data
# endregion