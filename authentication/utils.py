from django.contrib.auth.models import User
from playerdata.utils import make_player_data


def create_user(username, password, email):
    user = User.objects.create_user(
        username=username, password=password, email=email)
    make_player_data(user)
    return user
