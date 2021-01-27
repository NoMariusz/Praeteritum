from django.urls import path
from .views import UserView, RegisterUser, LoginUser, LogoutUser, \
    CheckAuthenticated

urlpatterns = [
    path('', UserView.as_view()),
    path('register', RegisterUser.as_view()),
    path('login', LoginUser.as_view()),
    path('logout', LogoutUser.as_view()),
    path('isAuthenticated', CheckAuthenticated.as_view())
]
