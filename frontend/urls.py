from django.urls import path
from .views import index, logged_index


urlpatterns = [
    path('', index, name="home"),
    path('login/', index),
    path('register/', index),
    path('match/<int:match_id>/', index),
    path('menu/', logged_index),
    path('menu/search', logged_index),
]
