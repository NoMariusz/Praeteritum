from django.test import TestCase

from match.logic.Match import Match
from .utils import make_test_users, make_match, make_test_card


class MatchWithCardDataTestCase(TestCase):
    """ parent class for tests needing match, player indexes and unit set on
     setUp method """

    def setUp(self):
        """ prepare variables for children """
        # prepare match
        test_players = make_test_users()
        self.match: Match = make_match(test_players)
        # made card for unit
        card = make_test_card()
        # prepare player indexes
        self.p1_index = 0
        self.p2_index = 1
        # made card data
        self.card_data: dict = self.match._cards_manager.made_card_data(
            card)
