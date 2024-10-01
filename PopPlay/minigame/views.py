from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status

from .models import *
from .serializers import *


# Create your views here.
class ThemeCategoryViewSet(ModelViewSet):
    queryset = ThemeCategory.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeCategorySerializer
    
    
class ThemeViewSet(ModelViewSet):
    queryset = Theme.objects.all().order_by('id').prefetch_related('category')
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeSerializer    
    
class MediaTypeViewSet(ModelViewSet):
    queryset = MediaType.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaTypeSerializer
    

class MediaViewSet(ModelViewSet):
    queryset = Media.objects.all().order_by('id').prefetch_related('type', 'answers')
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaSerializer
    

class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    serializer_class = TypeSerializer  


class MinigameViewSet(ModelViewSet):
    queryset = Minigame.objects.all().order_by('id').prefetch_related('type', 'theme', 'medias', 'notes')
    filter_backends = [DjangoFilterBackend]
    
    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'list':
            return MinigameLightSerializer
        elif self.action == 'add_note':
            return MinigameUserNoteSerializer
        return MinigameSerializer
    
    # ajout note
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
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
        
        return Response({'response': 'Le score a bien été ajouté'}, status=status.HTTP_201_CREATED)
