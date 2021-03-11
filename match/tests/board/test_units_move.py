from match.constants import BOARD_COLUMNS
from ..MatchWithCardDataTestCase import MatchWithCardDataTestCase


class UnitsMove(MatchWithCardDataTestCase):
    """ check if units in board can be moved, and if moves are proper
    restricted """

    def setUp(self):
        # prepare things to test by MatchWithUnitTestCase
        super().setUp()
        # made units by card data and add to board
        self.unit1_id = self.match._board.add_unit_by_card_data(
            self.card_data, self.p1_index, 0)
        self.unit2_id = self.match._board.add_unit_by_card_data(
            self.card_data, self.p2_index, 1)

    def test_normal_move(self):
        # make good move
        move_success = self.match._board.move_unit(
            self.p1_index, self.unit1_id, 2)
        self.assertTrue(move_success)

    def test_move_on_occupied_field(self):
        # make bad move because in field 2 is other unit
        move_success = self.match._board.move_unit(
            self.p1_index, self.unit1_id, 1)
        self.assertFalse(move_success)

    def test_moving_enemy_unit(self):
        # make bad move because player1 can not move player2 unit
        move_success = self.match._board.move_unit(
            self.p1_index, self.unit2_id, 3)
        self.assertFalse(move_success)

    def test_too_far_move(self):
        # make bad move because field is too far
        move_success = self.match._board.move_unit(
            self.p1_index, self.unit1_id, BOARD_COLUMNS-1)
        self.assertFalse(move_success)
