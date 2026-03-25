from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, StoryViewSet, CommentViewSet, HeelViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'stories', StoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'heels', HeelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
