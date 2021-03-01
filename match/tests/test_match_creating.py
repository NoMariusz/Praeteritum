from asgiref.sync import async_to_sync
from django.test import TestCase

from ..logic.MatchManager import match_manager
from .utils import make_test_users


class MatchCreating(TestCase):
    def setUp(self):
        test_players = async_to_sync(make_test_users)()
        self.match_id = async_to_sync(match_manager.make_match)(test_players)

    async def test_match_remember(self):
        """check if match remember his properties so overall work properly"""
        # get match
        match = await match_manager.get_match_by_id(self.match_id)
        # set him property
        match.match_name = 'test_match_name'
        # get again
        match2 = await match_manager.get_match_by_id(self.match_id)
        # check if property match
        self.assertEqual(match2.match_name, 'test_match_name')
