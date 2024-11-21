import django_filters
from minigame.models import Minigame

class MinigameFilter(django_filters.FilterSet):
    class Meta:
        model = Minigame
        fields = {
            'name': ['exact', 'icontains'],
            'type': ['in', 'exact'],
            'theme': ['in', 'exact'],
        }