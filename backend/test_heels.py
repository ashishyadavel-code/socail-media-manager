import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from content.models import Heel
from users.models import CustomUser
from django.core.files.uploadedfile import SimpleUploadedFile

user = CustomUser.objects.first()
if not user:
    user = CustomUser.objects.create_user(username='testuser', password='password')

video = SimpleUploadedFile("test.mp4", b"file_content", content_type="video/mp4")
heel1 = Heel.objects.create(user=user, video=video, caption="test 1")
heel2 = Heel.objects.create(user=user, video=video, caption="test 2")
print(f"Successfully created 2 heels for {user.username}: {heel1.id}, {heel2.id}")
