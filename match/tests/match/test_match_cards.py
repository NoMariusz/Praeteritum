from django.test import TestCase

from cards.models import CardModel
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
        # made it data
        data = match._cards_manager.made_card_data_by_id(card.id)
        self.assertEqual(test_card_name, data["name"])
