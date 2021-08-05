from django.test import TestCase

from cards.models import CardModel
from match.logic.match_modules.cards.CardFactory import CardFactory
from match.logic.match_modules.cards.CardsManager import CardsManager
from ..utils import make_test_users, send_to_sockets_dummy


class CardsFormat(TestCase):
    def test_good_format_cards(self):
        """ check if function formatting data in cards model return good data
        """
        test_card_name = "test_card_123#@!"
        test_attack = 20
        test_hp = 50
        # prepare
        test_players = make_test_users()
        cards_manager = CardsManager(send_to_sockets_dummy, test_players)
        # made card
        card = CardModel(
            name=test_card_name, category=CardModel.CardTypes.CAVALRYMAN,
            rarity=CardModel.CardRarities.COMMON, attack=test_attack,
            hp=test_hp)
        card.save()
        card_match_obj = CardFactory.make_card(card.id)
        # made data
        data = cards_manager.made_card_data(card_match_obj)
        self.assertEqual(test_card_name, data["name"])
        self.assertEqual(test_attack, data["attack"])
        self.assertEqual(test_hp, data["hp"])
