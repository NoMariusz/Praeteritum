from typing import Optional

from match.logic.match_modules.board_items.Unit import Unit
from match.logic.match_modules.board_items.Field import Field
from ..MatchWithCardDataTestCase import MatchWithCardDataTestCase


class BasePointsChange(MatchWithCardDataTestCase):
    """ check if base_points change when enemy unit is occupying base """

    def setUp(self):
        # prepare things to test by MatchWithUnitTestCase
        super().setUp()
        # made unit by card data and add to board
        self.unit_id = self.match._board.add_unit_by_card_data(
            self.card_data, self.p1_index, 0)

    def _find_player2_base_field(self) -> Optional[Field]:
        """ find field which is part of player's 2 base """
        for field in self.match._board._fields:
            if field.is_base and field.player_half == self.p2_index:
                return field
        # if not find any field is something not ok
        raise(ValueError(
            "Can not find any base field for player at index %s"
            % self.p2_index))

    def test_base_points_changing(self):
        # get player2 base field
        player2_field = self._find_player2_base_field()
        # make move to player2 base field
        unit1: Unit = self.match._board._get_unit_by_id(self.unit_id)
        unit1.move_points += 999    # modify move_points to move them far
        self.match._board.move_unit(
            self.p1_index, self.unit_id, player2_field.id_)
        # get start base points of player2
        start_points: dict = self.match._base_points[self.p2_index]
        # modify base points
        self.match._modify_base_points()
        # get points after check
        end_points: dict = self.match._base_points[self.p2_index]

        self.assertNotEqual(start_points, end_points)
