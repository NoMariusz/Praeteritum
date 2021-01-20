from django.urls import path
from .views import index


urlpatterns = [
    path('', index, name="home"),
    path('login/', index),
    path('register/', index),
    path('game/<int:match_id>/', index)
]
