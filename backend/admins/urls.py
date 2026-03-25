from django.urls import path
from .views import BlockUserView, UnblockUserView, DeleteUserView, DeletePostView, DeleteCommentView, AdminLoginView, AdminRegisterView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin_login'),
    path('register/', AdminRegisterView.as_view(), name='admin_register'),
    path('users/<int:pk>/block/', BlockUserView.as_view(), name='block_user'),
    path('users/<int:pk>/unblock/', UnblockUserView.as_view(), name='unblock_user'),
    path('users/<int:pk>/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('posts/<int:pk>/delete/', DeletePostView.as_view(), name='delete_post'),
    path('comments/<int:pk>/delete/', DeleteCommentView.as_view(), name='delete_comment'),
]
