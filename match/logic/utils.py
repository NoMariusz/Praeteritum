import random
from functools import wraps
from typing import Callable
from django.contrib.auth.models import User
from cards.utlis import get_deck_cards_ids_for_player
from .match_modules.board_items.Field import Field
from .match_modules.board_items.Unit import Unit
from ..constants import BOARD_COLUMNS, BOARD_ROWS, BASE_FIELDS_IDS, \
    STRONG_AGAINST_CAT_TO_CAT, WEAK_AGAINST_CAT_TO_CAT

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


# Board utils


def calc_distance_from_fields(old_field: Field, new_field: Field) -> int:
    """ calculate how far is field from field """
    distance: int = (abs(old_field.column - new_field.column)
                     + abs(old_field.row - new_field.row))
    return distance


def calc_attack_multiplier(attacker: Unit, defender: Unit) -> float:
    """ calculate bonus multilayer for given units """
    # if attacker is strong against defender
    if STRONG_AGAINST_CAT_TO_CAT[attacker.category] == defender.category:
        return 2
    # if attacker is weak against defender
    if WEAK_AGAINST_CAT_TO_CAT[attacker.category] == defender.category:
        return 0.5
    return 1


def make_fields() -> list:
    """ function making suitable fields objects for board and returning
    list of that fields sorted in id order """
    fields = []
    fields_count: int = BOARD_ROWS * BOARD_COLUMNS
    for field_id in range(fields_count):
        row: int = field_id // BOARD_ROWS
        column: int = field_id % BOARD_COLUMNS
        is_base: bool = field_id in BASE_FIELDS_IDS
        # player_half specify near which player is field, fields with
        # smaller id are near player 0, and fields with bigger id are
        # near player 1
        player_half: int = 1 if row > BOARD_ROWS / 2 else 0

        field = Field(field_id, row, column, is_base, player_half)
        fields.append(field)
    return fields
