from django.contrib.auth.models import User
from playerdata.utils import make_player_data
from utils.asyncs import run_as_async


async def create_user(username, password, email):
    user = await run_as_async(
        User.objects.create_user, username=username, password=password, 
        email=email)
    await make_player_data(user)
    return user
