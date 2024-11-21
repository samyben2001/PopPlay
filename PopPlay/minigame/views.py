from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status

from minigame.filters import MinigameFilter
from popplay.permissions import IsAccountOwnerOrIsStaffOrReadOnly, IsMinigameOwnerOrIsStaffOrReadOnly

from .models import *
from .serializers import *


# Create your views here.
class ThemeCategoryViewSet(ModelViewSet):
    queryset = ThemeCategory.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   
    
    
class ThemeViewSet(ModelViewSet):
    queryset = Theme.objects.all().order_by('id').prefetch_related('category')
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeSerializer 
    permission_classes = [IsAuthenticatedOrReadOnly]   
    
    
class MediaTypeViewSet(ModelViewSet):
    queryset = MediaType.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   
    
    
class AnswerViewSet(ModelViewSet):
    queryset = Answer.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # create an answer if it doesn't exist already else return it
    def create(self, request, *args, **kwargs):
        try:
            answer = Answer.objects.get(answer=request.data['answer'])
            return Response(AnswerSerializer(answer).data, status=status.HTTP_200_OK)
        except Answer.DoesNotExist:
            return super().create(request, *args, **kwargs)    
  
  
class QuestionViewSet(ModelViewSet):
    queryset = Question.objects.all().order_by('id').prefetch_related('answers')
    filter_backends = [DjangoFilterBackend]
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  
    
    # create an question if it doesn't exist already else return it
    def create(self, request, *args, **kwargs):
        try:
            question = Question.objects.get(question=request.data['question'])
            return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return super().create(request, *args, **kwargs)
    
    
class QuizViewSet(ModelViewSet):
    queryset = Quiz.objects.all().order_by('id').prefetch_related('answers', 'question')
    filter_backends = [DjangoFilterBackend]
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # create an quizz if it doesn't exist already else return it
    def create(self, request, *args, **kwargs):
        quiz = Quiz.objects.prefetch_related('answers').filter(question=request.data['question_id'])
        
        for q in quiz:
            if [a.id for a in q.answers.all().order_by('id')] == request.data['answers_id']:
                return Response(QuizSerializer(q).data, status=status.HTTP_200_OK)
                
        return super().create(request, *args, **kwargs)
    

class MediaViewSet(ModelViewSet):
    queryset = Media.objects.all().order_by('id').prefetch_related('type', 'answers')
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   
    # parser_classes = [MultiPartParser, FormParser]

    
# TODO: mapguess ViewSet

class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = TypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   


class MinigameViewSet(ModelViewSet):
    queryset = Minigame.objects.all().order_by('id').prefetch_related('type', 'theme', 'medias', 'notes', 'quizz')
    filter_backends = [DjangoFilterBackend]
    filterset_class = MinigameFilter
    permission_classes = [IsAuthenticatedOrReadOnly, IsMinigameOwnerOrIsStaffOrReadOnly]
    # TODO: add pagination
    # TODO: check if name of medias not already used in cloudflare
    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'list':
            return MinigameLightSerializer
        elif self.action == 'add_note':
            return MinigameUserNoteSerializer
        elif self.action == 'get_likes':
            return MinigameLikesSerializer
        return MinigameSerializer
    
    # ajout note
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAccountOwnerOrIsStaffOrReadOnly], url_path='notes')
    def add_note(self, request, pk):
        try:   
            minigame = self.get_object()
            account = Account.objects.get(id=request.data['account'])
            
            if account != request.user and request.user.is_staff is False:
                return Response({"error": "Vous n'avez pas le droit d'effectuer cette action."}, status=status.HTTP_403_FORBIDDEN)
            
        except Minigame.DoesNotExist:
            return Response({"error": "Minigame introuvable."}, status=status.HTTP_404_NOT_FOUND)
        except Account.DoesNotExist:
            return Response({"error": "Account introuvable."}, status=status.HTTP_404_NOT_FOUND)
            
        if MinigameUserNote.objects.filter(minigame=minigame, account=account).exists():
            return Response({'error': 'Ce jeu a dejà éte noté par le compte'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_note = MinigameUserNote.objects.create(minigame=minigame, account=account, note=request.data['note'])
        
        return Response({'response': 'La note a bien été ajoutée'}, status=status.HTTP_201_CREATED)
    
    # get likes
    @action(detail=True, methods=['get'],url_path='likes')
    def get_likes(self, request, pk):
        try:
            minigame = self.get_object()
            serializers = self.get_serializer(minigame, many=False)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Minigame.DoesNotExist:
            return Response({"error": "Minigame introuvable."}, status=status.HTTP_404_NOT_FOUND)
