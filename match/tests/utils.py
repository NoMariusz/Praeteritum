import random
from authentication.utils import create_user
from cards.models import CardModel
from ..logic.Match import Match


def make_match(players: list) -> Match:
    """ making match directly by Class constructor and return it """
    return Match(
        players=players,
        delete_callback=lambda _: _)


async def make_test_users() -> list:
    """ Make two test players in base and return list of them """
    user1 = await create_user(
        username='test1', password='test1', email='test1@tt.com')
    user2 = await create_user(
        username='test2', password='test2', email='test2@tt.com')
    return [user1, user2]


def make_test_card(
        card_type=CardModel.CardTypes.INFANTRYMAN, default_in_deck=False
        ) -> CardModel:
    """ make card, save it and return it"""
    card = CardModel(
        name="testCard%s" % random.random(), category=card_type,
        rarity=CardModel.CardRarities.COMMON, attack=1, hp=99,
        defaultInDeck=default_in_deck)
    card.save()
    return card
