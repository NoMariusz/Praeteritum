import asyncio
import pytest

from django.contrib.auth.models import User
from channels.db import database_sync_to_async

from ..logic.searching.MatchFinder import MatchFinder
from .utils import make_test_users


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_can_find_match():
    """ Check if MatchFinder work good and return new created match id to
    users correctly """
    # count number of users at start
    count = await database_sync_to_async(User.objects.count)()
    assert count == 0

    # make users
    players: list = await database_sync_to_async(make_test_users)()
    count: int = await database_sync_to_async(User.objects.count)()
    assert count == 2

    # make finders
    finder1 = await database_sync_to_async(MatchFinder)(players[0])
    finder2 = await database_sync_to_async(MatchFinder)(players[1])

    # start finding a match
    finding_coroutines = []
    finding_coroutines.append(finder1.find_match())
    finding_coroutines.append(finder2.find_match())

    # wait to all finders get match id
    match_ids = []

    async def wait_to_get_match_id(coroutine):
        match_ids.append(await coroutine)

    await asyncio.gather(
        wait_to_get_match_id(finding_coroutines[0]),
        wait_to_get_match_id(finding_coroutines[1])
    )
    assert match_ids[0] == match_ids[1]
