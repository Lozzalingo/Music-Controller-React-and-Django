from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('join', index),
    path('info', index),
    path('request-song', index),
    path('queue', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]