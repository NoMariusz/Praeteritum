from django.test import TestCase
from asgiref.sync import async_to_sync

from match.logic.Match import Match
from match.constants import BOARD_COLUMNS
from ..utils import make_test_users, make_match, make_test_card


class UnitsMove(TestCase):
    """ check if units in board can be moved, and if moves are proper
    restricted """

    def setUp(self):
        # prepare match
        test_players = async_to_sync(make_test_users)()
        self.match: Match = make_match(test_players)
        # made card for unit
        card = make_test_card()
        # prepare player indexes
        self.p1_index = 0
        self.p2_index = 1
        # made unit by card and add to board
        card_data: dict = self.match._made_card_data_by_id(card.id)
        self.unit1_id = self.match._board.add_unit_by_card_data(
            card_data, self.p1_index, 0)
        self.unit2_id = self.match._board.add_unit_by_card_data(
            card_data, self.p2_index, 1)

    def test_normal_move(self):
        # make good move
        move_succes = self.match._board.move_unit(
            self.p1_index, self.unit1_id, 2)
        self.assertTrue(move_succes)

    def test_move_on_occupied_field(self):
        # make bad move because in field 2 is other unit
        move_succes = self.match._board.move_unit(
            self.p1_index, self.unit1_id, 1)
        self.assertFalse(move_succes)

    def test_moving_enemy_unit(self):
        # make bad move because player1 can not move player2 unit
        move_succes = self.match._board.move_unit(
            self.p1_index, self.unit2_id, 3)
        self.assertFalse(move_succes)

    def test_too_far_move(self):
        # make bad move because field is too far
        move_succes = self.match._board.move_unit(
            self.p1_index, self.unit1_id, BOARD_COLUMNS-1)
        self.assertFalse(move_succes)
