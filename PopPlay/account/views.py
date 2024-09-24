from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User
from .models import Account
from .serializers import AccountSerializer

# Create your views here.
class RegisterView(CreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = AccountSerializer
    
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