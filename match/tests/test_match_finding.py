import asyncio
from django.test import TestCase

from ..logic.searching.MatchFinder import MatchFinder
from .utils import make_test_users


class FindingMatch(TestCase):
    async def test_can_find_match(self):
        """check if can find match, get proper ids"""

        finder_coros = []
        finders = []
        match_ids = []

        async def wait_to_get_match_id(coroutine):
            match_ids.append(await coroutine)

        # make users
        # start finding match to users
        test_players = await make_test_users()
        for user in test_players:
            finder = MatchFinder(user)
            # add finder to list so garbage collector can not delete them
            # before test end
            finders.append(finder)
            finder_coros.append(finder.find_match())
        # wait to all users receive match id
        await asyncio.gather(
            wait_to_get_match_id(finder_coros[0]),
            wait_to_get_match_id(finder_coros[1])
        )
        self.assertEqual(match_ids[0], match_ids[1])
