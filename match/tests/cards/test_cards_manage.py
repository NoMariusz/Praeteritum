from django.test import TestCase

from match.logic.match_modules.cards.CardsManager import CardsManager
from ..utils import make_test_users, send_to_sockets_dummy, make_test_card


class CardsDeckHandTests(TestCase):
    def setUp(self) -> None:
        # prepare card (function also saves card in db)
        self.card_match_obj = make_test_card(default_in_deck=True)
        # users should have in db default card made line above
        test_players = make_test_users()
        # prepare CardsManager
        self.cards_manager = CardsManager(send_to_sockets_dummy, test_players)

    def test_making_player_deck(self):
        """ check if CardsManager correctly initialize cards in decks """
        # in setup created test card which is in test players decks,
        # so cards_manager should have that card in deck after initialize
        self.assertEqual(
            self.card_match_obj.name, self.cards_manager.deck_cards[0][0].name)
        self.assertEqual(
            self.card_match_obj.name, self.cards_manager.deck_cards[1][0].name)

    def test_drawing_from_deck(self):
        """ check if CardsManager moving cards from deck to hand """
        # draw cards from deck to hand
        self.cards_manager.draw_cards(1, 0)
        self.cards_manager.draw_cards(1, 1)

        # test if players have card object in hands
        self.assertEqual(
            self.card_match_obj.name, self.cards_manager.hand_cards[0][0].name)
        self.assertEqual(
            self.card_match_obj.name, self.cards_manager.hand_cards[1][0].name)

    def test_finding(self):
        """ check if CardsManager find card by id """
        # get test card that exists after setup from cards_manager
        test_card = self.cards_manager.deck_cards[0][0]

        found_card = self.cards_manager.get_card_by_id(test_card.id)

        # test if test and found card are same
        self.assertEqual(test_card, found_card)

    def test_removing(self):
        """ check if CardsManager remove cards from hand """
        # get test card that exists after setup from cards_manager
        player_index = 0
        test_card = self.cards_manager.deck_cards[player_index][0]

        self.cards_manager.remove_card(test_card.id, player_index, False)

        # test if card isn't now in deck
        found_card = self.cards_manager.get_card_by_id(test_card.id)
        self.assertEqual(found_card, None)
