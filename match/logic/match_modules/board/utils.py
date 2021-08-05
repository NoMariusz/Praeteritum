from typing import Optional
from .items.Field import Field
from .items.Unit import Unit
from match.constants import BOARD_COLUMNS, BOARD_ROWS, BASE_FIELDS_IDS, \
    STRONG_AGAINST_CAT_TO_CAT, WEAK_AGAINST_CAT_TO_CAT


def get_unit_by_id(unit_id: int, units: list[Unit]) -> Optional[Unit]:
    """ try to find unit with given id
    :return: Unit or None - found or not unit """
    matches = [u for u in units if u.id_ == unit_id]
    if len(matches) <= 0:
        return None
    return matches[0]


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
