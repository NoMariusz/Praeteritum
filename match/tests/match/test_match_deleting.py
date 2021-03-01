import asyncio
from asgiref.sync import async_to_sync
from django.test import TestCase

from match.logic.Match import Match
from match.logic.MatchManager import MatchManager
from match.constatnts import MATCH_DELETE_TIMEOUT
from ..utils import make_test_users


class MatchAutoDeleting(TestCase):
    """ check if Match delete self proper """

    def setUp(self):
        # creating own match_manager to not influence to global
        # match_manager singleton
        self.match_manager = MatchManager()
        # make match by self.match_manager
        test_players = async_to_sync(make_test_users)()
        self.match_id: int = async_to_sync(
            self.match_manager.make_match)(test_players)

    def test_if_default_exists(self):
        """ check if after making Match match_manager add it to list """
        matches_len = len(self.match_manager.matches)
        self.assertEqual(matches_len, 1)

    async def test_when_nobody_connect(self):
        """ test if deleting when nobody is in Match """
        # wait to match should delete self
        await asyncio.sleep(MATCH_DELETE_TIMEOUT * 1.1)
        # check if match is deleted from match_manager list
        matches_len = len(self.match_manager.matches)
        self.assertEqual(matches_len, 0)

    async def test_when_match_end(self):
        """ test if deleting Match after game end """
        # get match by self.match_manager
        match: Match = await self.match_manager.get_match_by_id(self.match_id)
        # change base points to somebody lose
        match._players_data[0]["base_points"] = -4
        match._check_someone_win()
        # wait to match should delete self
        await asyncio.sleep(MATCH_DELETE_TIMEOUT * 1.1)
        # check if match is deleted from match_manager list
        matches_len = len(self.match_manager.matches)
        self.assertEqual(matches_len, 0)
