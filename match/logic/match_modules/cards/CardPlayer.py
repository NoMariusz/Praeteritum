from cards.models import CardModel
from ..board.Board import Board
from .CardAbstract import CardAbstract
from .UnitCard import UnitCard
from .CardsManager import CardsManager


class CardPlayer:
    def __init__(self, cards_manager: CardsManager, board: Board):
        self._board = board
        self._cards_manager = cards_manager

    def play_a_card(
            self, player_index: int, card_id: int, field_id: int) -> bool:
        """ try to play a card from hand to board
        :param player_index: int - index of player trying to play a card
        :param card_id: int - card id to play
        :param field_id: int - field id to play there card
        :return: bool - whether it worked """
        # check if can play card
        if not self._check_if_can_play_card(player_index, card_id, field_id):
            return False

        # get a card object
        card: CardAbstract = self._cards_manager.get_card_by_id(card_id)
        # decide how to throw a card because of its kind
        if card.kind == CardModel.CardKinds.UNIT:
            self._throw_unit_card(player_index, field_id, card)
        else:
            raise NotImplementedError

        return True

    def _check_if_can_play_card(
            self, player_index: int, card_id: int, field_id: int) -> bool:
        """ Check if card can be played properly
        :param player_index: int - index of player trying to play a card
        :param card_id: int - card id to play
        :param field_id: int - field id to play there card
        :return: bool - if card can be played """
        # check if card exists in hand
        if not self._cards_manager.check_if_card_in_hand(
                card_id, player_index):
            return False
        # check if player can play card at that field
        if not self._board.check_if_player_can_play_card(
                player_index, field_id):
            return False
        return True

    def _throw_unit_card(
            self, player_index: int, field_id: int, card: UnitCard):
        """ Make all actions to play UnitCard
        :param player_index: int - index of player trying to play a card
        :param field_id: int - field id to play there card
        :param card: UnitCard - card to play """
        card_data: dict = self._cards_manager.made_card_data(card)
        # remove card from hand
        self._cards_manager.remove_card(card.id, player_index)
        # create and add unit to board
        self._board.add_unit_by_card_data(card_data, player_index, field_id)
