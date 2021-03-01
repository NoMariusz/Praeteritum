from django.test import TestCase
from asgiref.sync import async_to_sync

from match.logic.Match import Match
from ..utils import make_test_users, make_match, make_test_card


class MatchWinDetection(TestCase):
    """ check if Match proper check if some player win """

    def setUp(self):
        # make card to players have card at start
        make_test_card(default_in_deck=True)
        # prepare match
        test_players = async_to_sync(make_test_users)()
        self.match: Match = make_match(test_players)
        # prepare player indexes
        self.p1_index = 0
        self.p2_index = 1

    def test_win_check_no_win(self):
        """ default game status, base_points full, cards at decks """
        check0_result: int = self.match._check_if_someone_win()
        # default player have points and cards so should return -1, nobody win
        self.assertEqual(-1, check0_result)

    def test_base_points(self):
        """ check win detection by changing base points """
        self.match._players_data[self.p1_index]["base_points"] = -4
        check1_result: int = self.match._check_if_someone_win()
        # if player1 lost all point then wind player2
        self.assertEqual(self.p2_index, check1_result)

    def test_base_points_draw(self):
        """ check draw by changing base points """
        for p_index in [self.p1_index, self.p2_index]:
            self.match._players_data[p_index]["base_points"] = 0
        check2_result: int = self.match._check_if_someone_win()
        # if both players lost points with the same count should be -2, draw
        self.assertEqual(-2, check2_result)

    def test_cards(self):
        """ test if match check win at cards count changes """
        # when player lost all cards
        self.match._players_data[self.p1_index]["hand_cards_ids"] = []
        self.match._players_data[self.p1_index]["deck_cards_ids"] = []
        check_result: int = self.match._check_if_someone_win()
        # when player1 have not any card, player2 win
        self.assertEqual(self.p2_index, check_result)

    def test_cards_draw(self):
        """ test if match detect draw at cards count changes """
        # when both player lost all cards
        for p_index in [self.p1_index, self.p2_index]:
            self.match._players_data[p_index]["hand_cards_ids"] = []
            self.match._players_data[p_index]["deck_cards_ids"] = []
        check2_result: int = self.match._check_if_someone_win()
        # when player1 and player2 have not any card should be -2, draw
        self.assertEqual(-2, check2_result)
