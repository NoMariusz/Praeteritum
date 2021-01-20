from django.urls import path
from .views import FindMatch, CancelFindMatch, ConnectToMatch

urlpatterns = [
    path('search', FindMatch.as_view()),
    path('cancel-search', CancelFindMatch.as_view()),
    path(':match-id', ConnectToMatch.as_view())
]
