import asyncio
from django.test import TestCase

from ...logic.MatchManager import MatchManager
from ...logic.Match import Match
from ...constatnts import TURN_TIME
from ..utils import make_test_users


class Matchturns(TestCase):
    async def test_match_turn_changing(self):
        """check if match turn changed in time correctly"""
        # make match
        test_players = await make_test_users()
        match_manager = MatchManager()
        match_id = await match_manager.make_match(test_players)
        match: Match = await match_manager.get_match_by_id(match_id)

        # get start turn, wait to change it, and assert if turn change
        start_turn = match._player_turn
        # wait a little bit longer to turn have time to change
        await asyncio.sleep(TURN_TIME*1.1)
        next_turn = match._player_turn
        self.assertNotEqual(start_turn, next_turn)
