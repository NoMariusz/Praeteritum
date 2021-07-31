from match.logic.match_modules.board.utils import make_fields
from match.logic.match_modules.cards.CardsManager import CardsManager
from match.logic.match_modules.board.UnitsManager import UnitsManager
from django.test import TestCase

from ..utils import make_test_card, make_test_users


class UnitsCreating(TestCase):
    def test_units_made_proper(self):
        """ check if board made proper units by given card data """
        # prepare variables

        def send_to_sockets_dummy():
            print("\tTry to send data to sockets")

        test_users = make_test_users()
        cards_manager = CardsManager(send_to_sockets_dummy, test_users)
        unit_manager = UnitsManager(send_to_sockets_dummy, make_fields())

        # made card
        card = make_test_card()
        # made unit by card
        card_data: dict = cards_manager.made_card_data(card)

        unit = unit_manager._create_new_unit(card_data, 1, -1)
        # check some information
        self.assertTrue(unit.name == card.name and unit.image == card.image)
