from rest_framework.generics import CreateAPIView, RetrieveDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action

from django.contrib.auth.models import User
from minigame.models import Theme, Minigame
from minigame.serializers import ThemeLightSerializer, MinigameExtraLightSerializer
from .models import Account
from .serializers import *
from popplay.permissions import IsAccountOwnerOrIsStaffOrReadOnly

# Create your views here.
class RegisterView(CreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        # Appel au serializer pour créer l'utilisateur
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Account.objects.create(user=user) 

        # Générer un token JWT après création de l'utilisateur
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
        
class AccountView(ModelViewSet):
    queryset = Account.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend]
    
    # set serializer class based on action
    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'list' or self.action == 'create':
            return AccountLightSerializer
        elif self.action == 'add_theme':
            return AccountThemeLikedSerializer
        elif self.action == 'add_game':
            return AccountMinigameLikedSerializer
        elif self.action == 'add_score':
            return AccountMinigameScoreSerializer
        return AccountSerializer
    
    # add theme as favorite
    @action(detail=True, methods=['post', 'get'], permission_classes=[IsAuthenticated, IsAccountOwnerOrIsStaffOrReadOnly], url_path='favoris/themes')
    def add_theme(self, request, pk):
        try:
            account = self.get_object()
            
            # Get method: get the list of favorite themes else POST method: add a favorite theme
            if request.method == 'GET':
                return Response({'themes_liked': ThemeLightSerializer(account.themes_liked, many=True).data}, status=status.HTTP_200_OK)
            
            theme = Theme.objects.get(id=request.data['themes_liked'])
        except Account.DoesNotExist:
            return Response({"error": "Account introuvable."}, status=status.HTTP_404_NOT_FOUND)
        except Theme.DoesNotExist:
            return Response({"error": "Theme introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        # If the theme is not already in the list, add it, else remove it
        if not account.themes_liked.contains(theme):
            account.themes_liked.add(theme)
            account.save()
            return Response({'response': f'Theme {theme.name} ajouté aux favoris'},status=status.HTTP_201_CREATED)
        else:
            account.themes_liked.remove(theme)
            account.save()
            return Response({'response': f'Theme {theme.name} retiré des favoris'},status=status.HTTP_201_CREATED)
    
    # add game as favorite
    @action(detail=True, methods=['post', 'get'], permission_classes=[IsAuthenticated, IsAccountOwnerOrIsStaffOrReadOnly], url_path='favoris/games')
    def add_game(self, request, pk):
        try:
            account = self.get_object()
            
            # Get method: get the list of favorite games else POST method: add a favorite game
            if request.method == 'GET':
                return Response({'games_liked': MinigameExtraLightSerializer(account.games_liked, many=True).data}, status=status.HTTP_200_OK)
            
            minigame = Minigame.objects.get(id=request.data['games_liked'])
            
        except Account.DoesNotExist:
            return Response({"error": "Account introuvable."}, status=status.HTTP_404_NOT_FOUND)
        except Minigame.DoesNotExist:
            return Response({"error": "Minigame introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        # If the game is not already in the list, add it, else remove it
        if not account.games_liked.contains(minigame):
            account.games_liked.add(minigame)
            account.save()
            return Response({'response': f'Minigame {minigame.name} ajouté aux favoris'},status=status.HTTP_201_CREATED)
        else:
            account.games_liked.remove(minigame)
            account.save()
            return Response({'response': f'Minigame {minigame.name} retiré des favoris'},status=status.HTTP_201_CREATED)
    
    # add user score
    @action(detail=True, methods=['post', 'get'], url_path='scores', permission_classes=[IsAuthenticated, IsAccountOwnerOrIsStaffOrReadOnly])
    def add_score(self, request, pk):
        try:
            account = self.get_object()
            
            if request.method == 'GET':
                return Response({'scores': AccountMinigameScoreSerializer(UserMinigameScore.objects.filter(account=account), many=True).data}, status=status.HTTP_200_OK)
            
            minigame = Minigame.objects.get(id=request.data['minigame'])
        except Account.DoesNotExist:
            return Response({"error": "Account introuvable."}, status=status.HTTP_404_NOT_FOUND)
        except Minigame.DoesNotExist:
            return Response({"error": "Minigame introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_score = UserMinigameScore.objects.create(account=account, minigame=minigame, score=request.data['score'])
        return Response({'response': f'Le score a bien été ajouté'}, status=status.HTTP_201_CREATED)
