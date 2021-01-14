from django.contrib import admin
from django.urls import path, include
from .views import index


urlpatterns = [
    path('', index, name="home"),
    path('login/', index),
    path('register/', index)
]
