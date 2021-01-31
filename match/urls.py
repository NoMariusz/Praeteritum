from django.urls import path
from .views import CancelFindMatch, FindMatch

urlpatterns = [
    path('search', FindMatch.as_view()),
    path('cancel-search', CancelFindMatch.as_view()),
]
