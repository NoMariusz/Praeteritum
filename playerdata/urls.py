from django.urls import path
from .views import AccountData

urlpatterns = [
    path('account-short', AccountData.as_view()),
]
