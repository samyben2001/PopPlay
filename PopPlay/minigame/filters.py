import django_filters
from minigame.models import Media, Minigame

class MinigameFilter(django_filters.FilterSet):
    class Meta:
        model = Minigame
        fields = {
            'name': ['exact', 'icontains'],
            'type': ['in', 'exact'],
            'theme': ['in', 'exact'],
        }
        
class MediaFilter(django_filters.FilterSet):
    class Meta:
        model = Media
        fields = {
                  'type': ['in', 'exact'],
                  'account': ['exact'],
                  }