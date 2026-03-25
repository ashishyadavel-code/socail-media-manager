from rest_framework import generics, status, views, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from notifications.models import Notification

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

class FollowUserView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        user_to_follow = get_object_or_404(User, pk=pk)
        if request.user == user_to_follow:
            return Response({'detail': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.followers.add(user_to_follow)

        Notification.objects.create(
            recipient=user_to_follow,
            sender=request.user,
            message=f"{request.user.username} started following you."
        )

        return Response({'detail': f'Started following {user_to_follow.username}'})

class UnfollowUserView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        user_to_unfollow = get_object_or_404(User, pk=pk)
        request.user.followers.remove(user_to_unfollow)
        return Response({'detail': f'Unfollowed {user_to_unfollow.username}'})
