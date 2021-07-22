import random
from functools import wraps
from typing import Callable
from django.contrib.auth.models import User
from cards.utlis import get_deck_cards_ids_for_player


# utils for Match


def run_only_when_player_has_turn(func) -> Callable:
    """ decorator allowing run only when player has turn,
    function decorates should have 'player_index' arg """
    @wraps(func)
    def wrapper(self, player_index: int, *args, **kwargs):
        """ :param self: - instance of Match which func is decorated
        :param player_index: - index of player requesting for action """
        # if is not the player turn he can not run func
        if self._player_turn != player_index:
            return False

        return func(self, player_index, *args, **kwargs)
    return wrapper


def get_opposed_index(player_index: int) -> int:
    return (player_index + 1) % 2

# utils for CardsManager


def get_player_deck(player: User) -> list:
    """ :return: list - shuffled deck cards ids for player """
    # get cards for player
    player_cards_ids: list = get_deck_cards_ids_for_player(player)
    # shuffle cards in deck
    random.shuffle(player_cards_ids)
    return player_cards_ids
