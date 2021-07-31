from django.test import TestCase

from cards.models import CardModel
from match.logic.match_modules.cards.CardFactory import CardFactory
from ...logic.Match import Match
from ..utils import make_test_users, make_match


class MatchCards(TestCase):
    def test_match_good_format_cards(self):
        """ check if function formatting data in cards model return good data
        """
        test_card_name = "test_card_123#@!"
        # made match
        test_players = make_test_users()
        match: Match = make_match(test_players)
        # made card
        card = CardModel(
            name=test_card_name, category=CardModel.CardTypes.CAVALRYMAN,
            rarity=CardModel.CardRarities.COMMON, attack=20, hp=60)
        card.save()
        card_match_obj = CardFactory.make_card(card.id)
        # made data
        data = match._cards_manager.made_card_data(card_match_obj)
        self.assertEqual(test_card_name, data["name"])
