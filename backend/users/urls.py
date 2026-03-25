from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, UserProfileView, UserListView, FollowUserView, UnfollowUserView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('<int:pk>/profile/', UserProfileView.as_view(), name='user_profile'),
    path('list/', UserListView.as_view(), name='user_list'),
    path('<int:pk>/follow/', FollowUserView.as_view(), name='follow_user'),
    path('<int:pk>/unfollow/', UnfollowUserView.as_view(), name='unfollow_user'),
]
