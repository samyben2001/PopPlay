from rest_framework import permissions

class IsAccountOwnerOrIsStaffOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or staff to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    # Message display if permission is denied
    message = {'error': "Vous n'avez pas le droit d'effectuer cette action."}

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_staff:
            return True

        # Instance must have an attribute named `user`.
        return obj.user == request.user
    

class IsMinigameOwnerOrIsStaff(permissions.BasePermission):
    message = {'error': "Vous n'avez pas le droit d'effectuer cette action. Vous n'êtes pas l'auteur de ce jeu."}

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_staff:
            return True

        # Instance must have an attribute named `user`.
        return obj.author == request.user.account
    
