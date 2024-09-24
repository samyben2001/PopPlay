from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *

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


class MinigameViewSet(ModelViewSet):
    queryset = Minigame.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = MinigameSerializer