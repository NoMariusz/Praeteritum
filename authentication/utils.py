from django.contrib.auth.models import User
from playerdata.utils import make_player_data
from asgiref.sync import sync_to_async


async def create_user(username, password, email):
    user = await sync_to_async(User.objects.create_user)(
        username=username, password=password, email=email)
    await make_player_data(user)
    return user
