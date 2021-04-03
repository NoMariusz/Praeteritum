from django.urls import path
from .views import CancelFindMatch, FindMatch, ActiveMatches

urlpatterns = [
    path('search', FindMatch.as_view()),
    path('cancel-search', CancelFindMatch.as_view()),
    path('active-matches', ActiveMatches.as_view())
]
