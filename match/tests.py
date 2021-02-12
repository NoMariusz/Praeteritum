import asyncio
from asgiref.sync import sync_to_async
from django.test import TestCase
from django.contrib.auth.models import User

from authentication.utils import create_user
from .match.MatchFinder import MatchFinder
from .match.MatchManager import match_manager
from .constatnts import TURN_TIME


class FindMatch(TestCase):
    async def test_can_find_match(self):
        """check if can find match, get proper ids"""

        finder_coros = []
        match_ids = []

        async def wait_to_get_match_id(coroutine):
            match_ids.append(await coroutine)

        # make users
        # start finding match to users
        test_players = await make_test_users()
        for user in test_players:
            finder = MatchFinder(user)
            finder_coros.append(finder.find_match())
        # wait to all users recieve match id
        await asyncio.gather(
            wait_to_get_match_id(finder_coros[0]),
            wait_to_get_match_id(finder_coros[1])
        )
        self.assertEqual(match_ids[0], match_ids[1])


class CreateMatch(TestCase):
    async def test_match_not_forgot(self):
        """check if match remember his properties so overall work properly"""
        test_players = await make_test_users()
        match_id = await match_manager.make_match(test_players)

        # get match, set him property, get again and check if property match
        match = await match_manager.get_match_by_id(match_id)
        match.match_name = 'test_match_name'
        match2 = await match_manager.get_match_by_id(match_id)
        self.assertEqual(match2.match_name, 'test_match_name')

    async def test_match_turn_changing(self):
        """check if match turn changed in time correctly"""
        # make match
        test_players = await make_test_users()
        match_id = await match_manager.make_match(test_players)
        match = await match_manager.get_match_by_id(match_id)

        # get start turn, wait to change it, and assert if turn change
        start_turn = match.player_turn
        print("get start turn", start_turn)
        # wait a little bit longer to turn have time to change
        await asyncio.sleep(TURN_TIME*1.1)
        next_turn = match.player_turn
        print("get next_turn", next_turn)
        self.assertNotEqual(start_turn, next_turn)


# utils for tests
async def make_test_users():
    """ Make two test players in base and return list of them """
    user1 = await create_user(
        username='test1', password='test1', email='test1@tt.com')
    user2 = await create_user(
        username='test2', password='test2', email='test2@tt.com')
    return [user1, user2]
