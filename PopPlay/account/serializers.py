from rest_framework import serializers
from django.contrib.auth.models import User

class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        """
        Vérifie que les deux mots de passe correspondent.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data
                  
    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])  # Hash le mot de passe
        user.save()
        return user