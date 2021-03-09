from typing import Callable
from ..utils import get_player_deck
from cards.models import CardModel
from cards.serializers import CardSerializer


class CardsManager:
    """ manage Cards in match, store information about them and enable to
    operate on them and send information about changes to sockets """

    def __init__(self, send_to_sockets: Callable, players: list):
        """ :param send_to_sockets: Callable - function from parent which
        enable sending messages to socket
        :param players: list - list of users which cards should manage """
        self._send_to_sockets = send_to_sockets

        self.hand_cards_ids = [[], []]
        self.deck_cards_ids = [
            get_player_deck(players[0]), get_player_deck(players[1])]

    def draw_cards(self, count: int, player_index: int) -> bool:
        """ move cards from deck to hand
        :param count: int - amount of cards to draw
        :param player_index: int - index of player which drawing cards """
        deck: list = self.deck_cards_ids[player_index]
        hand: list = self.hand_cards_ids[player_index]

        for move in range(count):
            # if deck is empty can not draw card from it
            if len(deck) <= 0:
                return False
            card_id: int = deck.pop()
            hand.append(card_id)

        self._send_to_sockets_decks_cards_count_changed(player_index)
        self.send_to_sockets_hand_changed(player_index)
        return True

    @staticmethod
    def made_card_data_by_id(card_id: int) -> dict:
        """ Get card object by given card_id, then made from that card data
        dict friendly for frontend """
        card: CardModel = CardModel.objects.get(id=card_id)
        card_serializer: CardSerializer = CardSerializer(card)
        return card_serializer.data

    def get_cards_data(self, player_index: int) -> list:
        """ Get list of cards objects for specified player """
        player_hand_ids = self.hand_cards_ids[player_index]
        cards_data: list = list(map(
            lambda id_: self.made_card_data_by_id(id_),
            player_hand_ids))
        return cards_data

    def _send_to_sockets_decks_cards_count_changed(self, player_index: int):
        message = {
            'name': 'deck-cards-count-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_count': len(self.deck_cards_ids[player_index])
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
