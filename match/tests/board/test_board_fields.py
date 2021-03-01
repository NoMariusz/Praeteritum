from django.test import TestCase
from asgiref.sync import async_to_sync

from ...logic.Match import Match
from ...constatnts import BOARD_ROWS, BOARD_COLUMNS
from ..utils import make_test_users, make_match


class BoardFields(TestCase):
    def test_fields_are_put_in_order_for_player(self):
        """ check if board returning fields in proper order for players"""
        # made match
        test_players = async_to_sync(make_test_users)()
        match: Match = make_match(test_players)
        # get fields
        fields_for_0: list = match._board.get_fields_dicts(0)
        fields_for_1: list = match._board.get_fields_dicts(1)
        # get fields ids for specified players
        first_field_id_for_0: int = fields_for_0[0]["id"]
        first_field_id_for_1: int = fields_for_1[0]["id"]
        # check fields ids_ are proper for players, that id 0 is first for
        # player 0
        id_for_0_ok = first_field_id_for_0 == 0
        id_for_1_ok = first_field_id_for_1 == BOARD_COLUMNS * BOARD_ROWS - 1

        self.assertTrue(id_for_0_ok and id_for_1_ok)
