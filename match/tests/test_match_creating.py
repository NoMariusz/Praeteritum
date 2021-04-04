from django.test import TestCase

from ..logic.MatchManager import MatchManager
from .utils import make_test_users


class MatchCreating(TestCase):
    def setUp(self):
        test_players = make_test_users()
        self.match_manager = MatchManager()
        self.match_id = self.match_manager.make_match(test_players)

    def test_match_remember(self):
        """check if match remember his properties so overall work properly"""
        # get match
        match = self.match_manager.get_match_by_id(self.match_id)
        # set him property
        match.match_name = 'test_match_name'
        # get again
        match2 = self.match_manager.get_match_by_id(self.match_id)
        # check if property match
        self.assertEqual(match2.match_name, 'test_match_name')
