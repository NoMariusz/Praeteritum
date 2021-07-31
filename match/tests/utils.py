import random
from authentication.utils import create_user
from cards.models import CardModel
from match.logic.match_modules.cards.CardAbstract import CardAbstract
from match.logic.match_modules.cards.CardFactory import CardFactory
from ..logic.Match import Match


def send_to_sockets_dummy(message=None, modify=None):
    print("\tTry to send data to sockets, with params: message:%s, modify:%s"
          % (message, modify))


def make_match(players: list) -> Match:
    """ making match directly by Class constructor and return it """
    return Match(
        players=players,
        delete_callback=lambda _: _)


def make_test_users() -> list:
    """ Make two test players in base and return list of them """
    user1 = create_user(
        username='test1', password='test1', email='test1@tt.com')
    user2 = create_user(
        username='test2', password='test2', email='test2@tt.com')
    return [user1, user2]


def make_test_card(
        card_type=CardModel.CardTypes.INFANTRYMAN, default_in_deck=False
        ) -> CardAbstract:
    """ make card, save it and return it"""
    # make dummy card in db
    db_card = CardModel(
        name="testCard%s" % random.random(), category=card_type,
        rarity=CardModel.CardRarities.COMMON, attack=1, hp=99,
        defaultInDeck=default_in_deck)
    db_card.save()
    # now create card object for match
    card: CardAbstract = CardFactory.make_card(db_card.id)

    return card
