from django.test import TestCase
from django.contrib.auth.models import User
from .utils.MatchFinder import MatchFinder
from .utils.MatchManager import match_manager
from asgiref.sync import sync_to_async
import asyncio


class FindMatch(TestCase):
    async def test_can_find_match(self):
        """if can find match, get proper ids"""

        finder_coros = []
        match_ids = []

        async def wait_to_get_match_id(coroutine):
            match_ids.append(await coroutine)

        # make users
        user1 = await sync_to_async(User.objects.create_user)(
            username='test1', password='test1', email='test1@tt.com')
        user2 = await sync_to_async(User.objects.create_user)(
            username='test2', password='test2', email='test2@tt.com')
        # start finding match to users
        for user in [user1, user2]:
            finder = MatchFinder(user)
            finder_coros.append(finder.find_match())
        # wait to all users recieve match id
        await asyncio.gather(
            wait_to_get_match_id(finder_coros[0]),
            wait_to_get_match_id(finder_coros[1])
        )
        # print("tested find match ids: ", match_ids)
        self.assertEqual(match_ids[0], match_ids[1])


class CreateMatch(TestCase):
    async def test_match_not_forgot(self):
        """if match remember his properties, because if I try to migrate them
        to model it was issues"""
        match_id = await match_manager.make_match(['player1', 'player2'])

        match = await match_manager.get_match_by_id(match_id)
        match.channel_layer = 'test_channel_layer'
        match2 = await match_manager.get_match_by_id(match_id)
        self.assertEqual(match2.channel_layer, 'test_channel_layer')
