from django.test import TestCase

from cards.models import CardModel
from match.logic.match_modules.cards.CardFactory import CardFactory
from match.logic.match_modules.cards.CardsManager import CardsManager

from ..utils import make_test_users, send_to_sockets_dummy


class Cardsfinding(TestCase):
    def test_finding_cards(self):
        """ check if finding cards by id works """
        # prepare
        test_players = make_test_users()
        cards_manager = CardsManager(send_to_sockets_dummy, test_players)
        # made card
        card = CardModel(
            name="test", category=CardModel.CardTypes.CAVALRYMAN,
            rarity=CardModel.CardRarities.COMMON, attack=1,
            hp=1)
        card.save()
        card_match_obj = CardFactory.make_card(card.id)
        # add card to manager have that card in his cards collection
        cards_manager.deck_cards[0].append(card_match_obj)
        # try to fing card
        found_card = cards_manager._get_card_by_id(card_match_obj.id)
        # assert
        self.assertEqual(card_match_obj.id, found_card.id)
