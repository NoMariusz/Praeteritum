from django.urls import path
from .views import CancelFindMatch, ConnectToMatch, find_match

urlpatterns = [
    path('search', find_match),
    path('cancel-search', CancelFindMatch.as_view()),
    path('<int:match_id>', ConnectToMatch.as_view())
]
