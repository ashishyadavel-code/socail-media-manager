from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Story, Comment, Heel
from .serializers import PostSerializer, StorySerializer, CommentSerializer, HeelSerializer
from notifications.models import Notification

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['caption', 'user__username']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all().order_by('-created_at')
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        if comment.post.user != self.request.user:
            Notification.objects.create(
                recipient=comment.post.user,
                sender=self.request.user,
                post=comment.post,
                message=f"{self.request.user.username} commented on your post."
            )

class HeelViewSet(viewsets.ModelViewSet):
    queryset = Heel.objects.all().order_by('-created_at')
    serializer_class = HeelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['caption', 'user__username']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
