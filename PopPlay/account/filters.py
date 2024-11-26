import django_filters
from account.models import Account

class AccountMinigameFilter(django_filters.FilterSet):
    class Meta:
        model = Account
        fields = {
            'minigames__name': ['exact', 'icontains'],
            'minigames__type': ['in', 'exact'],
            'minigames__theme': ['in', 'exact'],
        }