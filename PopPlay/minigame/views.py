from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *

#TODO: add permissions

# Create your views here.
class ThemeCategoryViewSet(ModelViewSet):
    queryset = ThemeCategory.objects.all() 
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeCategorySerializer
    
    
class ThemeViewSet(ModelViewSet):
    queryset = Theme.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = ThemeSerializer    
    
class MediaTypeViewSet(ModelViewSet):
    queryset = MediaType.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaTypeSerializer
    

class MediaViewSet(ModelViewSet):
    queryset = Media.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = MediaSerializer
    

class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = TypeSerializer  


class MinigameViewSet(ModelViewSet):
    queryset = Minigame.objects.all()
    filter_backends = [DjangoFilterBackend]
    
    def get_serializer_class(self, *args, **kwargs): #
        if self.action == 'list':
            return MinigameLightSerializer
        return MinigameSerializer
    

class MinigameUserNoteViewSet(ModelViewSet):
    queryset = MinigameUserNote.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = MinigameUserNoteSerializer
    