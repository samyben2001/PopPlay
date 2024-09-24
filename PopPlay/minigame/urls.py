from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter() 
router.register('themeCategory', views.ThemeCategoryViewSet, basename='create-themeCategory')
router.register('theme', views.ThemeViewSet, basename='create-theme')
router.register('mediaType', views.MediaTypeViewSet, basename='create-mediaType')
router.register('media', views.MediaViewSet, basename='create-media')
router.register('type', views.TypeViewSet, basename='create-type')
router.register('minigameUserNote', views.MinigameUserNoteViewSet, basename='create-minigameUserNote')
router.register('', views.MinigameViewSet, basename='create-minigame')

urlpatterns = [
    path('minigame/', include(router.urls)),
]