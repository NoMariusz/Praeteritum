from django.urls import path
from .consumers.MatchConsumer import MatchConsumer
from .consumers.FindMatchConsumer import FindMatchConsumer

''' routing for asgi stuff '''

websocket_urlpatterns = [
    path('match-api/<int:match_id>/', MatchConsumer.as_asgi()),
]

http_urlpatterns = [
    path('match-api/search', FindMatchConsumer.as_asgi()),
]
