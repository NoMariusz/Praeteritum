from django.test import TestCase
from asgiref.sync import async_to_sync

from match.logic.Match import Match
from ..utils import make_test_users, make_match, make_test_card


class UnitsCreating(TestCase):
    def test_units_made_proper(self):
        """ check if board made proper units by given card data """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = make_match(test_players)
        # made card
        card = make_test_card()
        # made unit by card
        card_data: dict = match._made_card_data_by_id(card.id)
        unit = match._board._create_new_unit(card_data, 1, -1)
        # check some informations
        self.assertTrue(unit.name == card.name and unit.image == card.image)