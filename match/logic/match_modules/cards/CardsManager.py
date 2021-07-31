import itertools
import random
from typing import Callable
from django.contrib.auth.models import User

from match.logic.match_modules.cards.CardAbstract import CardAbstract
from cards.serializers import CardSerializer
from cards.utlis import get_deck_cards_ids_for_player
from .CardFactory import CardFactory


class CardsManager:
    """ manage Cards in match, store information about them and enable to
    operate on them and send information about changes to sockets """

    def __init__(self, send_to_sockets: Callable, players: list):
        """ :param send_to_sockets: Callable - function from parent which
        enable sending messages to socket
        :param players: list - list of users which cards should manage """
        self._send_to_sockets = send_to_sockets

        self.hand_cards = [[], []]
        self.deck_cards = [
            self.make_player_deck(players[0]),
            self.make_player_deck(players[1])]

    def make_player_deck(self, player: User) -> list:
        """ :return: list - shuffled deck cards for player """
        # get cards for player
        player_cards_ids: list = get_deck_cards_ids_for_player(player)
        # shuffle cards in deck
        random.shuffle(player_cards_ids)
        # make cards objects
        player_cards = list(map(
            lambda card_id: CardFactory.make_card(card_id),
            player_cards_ids))
        return player_cards

    def draw_cards(self, count: int, player_index: int) -> bool:
        """ move cards from deck to hand
        :param count: int - amount of cards to draw
        :param player_index: int - index of player which drawing cards """
        deck: list = self.deck_cards[player_index]
        hand: list = self.hand_cards[player_index]

        for _ in range(count):
            # if deck is empty can not draw card from it
            if len(deck) <= 0:
                return False
            card: CardAbstract = deck.pop()
            hand.append(card)

        self._send_to_sockets_decks_cards_count_changed(player_index)
        self.send_to_sockets_hand_changed(player_index)
        return True

    # managing cards utils

    def _get_card_by_id(self, card_id: int) -> CardAbstract:
        # make collection with all cards
        cards_coll = list(itertools.chain(*self.hand_cards, *self.deck_cards))
        # get card
        results = [card for card in cards_coll if card.id == card_id]
        return results[0] if len(results) > 0 else None

    def check_if_card_in_hand(self, card_id: int, player_index: int) -> bool:
        """ Checking if card with given id is present in player hand
        :return: bool - if card is present in player hand """
        player_hand: list[CardAbstract] = self.hand_cards[player_index]
        filtered: list = [el for el in player_hand if el.id == card_id]
        return len(filtered) > 0

    def remove_card(self, card_id: int, player_index: int):
        player_hand: list = self.hand_cards[player_index]
        print("before change")
        print(player_hand)
        # remove card with specified id from array
        self.hand_cards[player_index] = [
            card for card in player_hand if card.id != card_id]
        print("after change")
        print(self.hand_cards[player_index])
        print(player_hand)

        self.send_to_sockets_hand_changed(player_index)

    # getting cards data

    @staticmethod
    def made_card_data(card: CardAbstract) -> dict:
        """ Made card data dict friendly for frontend """
        card_serializer: CardSerializer = CardSerializer(card)
        return card_serializer.data

    def made_card_data_by_id(self, card_id: int) -> dict:
        card: CardAbstract = self._get_card_by_id(card_id)
        if card is None:
            raise ValueError("Can't found card with given id")
        return CardsManager.made_card_data(card)

    def get_cards_data(self, player_index: int) -> list[dict]:
        """ Get list of cards dicts for specified player """
        player_hand = self.hand_cards[player_index]
        cards_data: list = list(map(
            lambda card: self.made_card_data(card),
            player_hand))
        return cards_data

    # sockets

    def _send_to_sockets_decks_cards_count_changed(self, player_index: int):
        message = {
            'name': 'deck-cards-count-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_count': len(self.deck_cards[player_index])
            }
        }
        self._send_to_sockets(message, modify=False)

    def send_to_sockets_hand_changed(self, player_index: int):
        message = {
            'name': 'hand-cards-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_cards': self.get_cards_data(player_index)
            }
        }
        self._send_to_sockets(message, modify=True)
