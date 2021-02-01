from django.urls import path
from .consumers import MatchConsumer

''' routing for asgi stuff, mainly web sockets '''

websocket_urlpatterns = [
    path('match-api/<int:match_id>/', MatchConsumer.as_asgi()),
]
