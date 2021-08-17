from cards.models import CardModel
from match.logic.match_modules.board.items.Unit import Unit
from match.constants import BOARD_COLUMNS, DEFAULT_ENERGY
from ..utils import make_test_card
from match.logic.match_modules.board.utils import get_unit_by_id
from ..MatchWithCardDataTestCase import MatchWithCardDataTestCase


class UnitsAttacks(MatchWithCardDataTestCase):
    """ check if units in board can attack each other and if his attacks
    are proper restricted"""

    def setUp(self):
        # prepare things to test by MatchWithUnitTestCase
        super().setUp()
        # made special MISSLEMAN card for unit
        card3 = make_test_card(CardModel.CardTypes.MISSLEMAN)
        # made MISSLEMAN unit by card3
        card_data3: dict = self.match._cards_manager.made_card_data(
            card3)
        # made units
        self.unit1_id = self.match._board.add_unit_by_card_data(
            self.card_data, self.p1_index, 1)
        self.unit2_id = self.match._board.add_unit_by_card_data(
            self.card_data, self.p2_index, 2)
        self.unit3_id = self.match._board.add_unit_by_card_data(
            card_data3, self.p2_index, 0)

    def test_normal_attack(self):
        # make good attack
        action_1_success = self.match._board.attack_unit(
            self.p1_index, self.unit1_id, self.unit2_id)
        self.assertTrue(action_1_success)

    def test_energy(self):
        # make bad attack because unit1 has not attack points
        for i in range(DEFAULT_ENERGY):   # to drain attack points
            self.match._board.attack_unit(
                self.p1_index, self.unit1_id, self.unit2_id)
        action_2_success = self.match._board.attack_unit(
            self.p1_index, self.unit1_id, self.unit2_id)
        # to restore attack points
        self.match._board.on_turn_change(self.p1_index)
        self.assertFalse(action_2_success)

    def test_attacking_by_enemy_unit(self):
        # make bad attack because player1 can not attack by player2 unit
        action_3_success = self.match._board.attack_unit(
            self.p1_index, self.unit2_id, self.unit1_id)
        self.assertFalse(action_3_success)

    def test_attacking_out_of_range(self):
        # make bad attack because unit is too far

        # get unit2
        unit2 = get_unit_by_id(self.unit2_id, self.match._board._units)
        unit2.energy += 999    # modify energy to move them far
        # move unit2 far from unit1
        self.match._board.move_unit(
            self.p2_index, self.unit2_id, BOARD_COLUMNS-1)
        action_4_success = self.match._board.attack_unit(
            self.p1_index, self.unit1_id, self.unit2_id)
        self.assertFalse(action_4_success)

    def test_attacking_self(self):
        # make bad attack because can not attack himself
        action_5_success = self.match._board.attack_unit(
            self.p1_index, self.unit1_id, self.unit1_id)
        self.assertFalse(action_5_success)

    def test_missleman_not_attack_as_defender(self):
        """ check if units of type MISSLEMAN only deal damage when they attack
        """
        # get start hp of normal INFANTRYMAN Unit
        unit1: Unit = get_unit_by_id(self.unit1_id, self.match._board._units)
        start_hp: int = unit1.hp
        # attack as INFANTRYMAN MISSLEMAN Unit
        self.match._board.attack_unit(
            self.p1_index, self.unit1_id, self.unit3_id)
        # get hp of INFANTRYMAN Unit after attack
        end_hp: int = unit1.hp

        # check if hp not changed
        self.assertEqual(start_hp, end_hp)
