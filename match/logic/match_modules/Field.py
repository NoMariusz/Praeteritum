from enum import Enum
from ...constatnts import BOARD_ROWS, BOARD_COLUMNS


class FieldCordinates(Enum):
    ROW = 0
    COLUMN = 1


class Field:
    def __init__(self, id_: int, row: int, column: int, is_base: bool,
                 player_half: int):
        """
        :param id_: int - id given by parent
        :pram is_base: bool - store if field is base, so player can there
        place card from hand
        :param player_half: int - player index in whose half of the board is
        field
        """
        self.id_ = id_
        self.row = row
        self.column = column
        self.is_base = is_base
        self.player_half = player_half

    @staticmethod
    def _get_opposed(value: int, coordinate: FieldCordinates) -> int:
        """
        :param value: int - value to oppose
        :param coordinate: FieldCordinates - specify if oppose row or column
        :return: int - return opposed value
        """
        max_value = BOARD_COLUMNS if coordinate == FieldCordinates.COLUMN \
            else BOARD_ROWS
        return abs(value - max_value) - 1

    def get_data_for_frontend(self, reverse: bool) -> dict:
        """ :param reverse: bool - specify if row and column should be opposed
        to actual, to render board in frontend facing the proper player
        :return: dict - contain data for frontned in dict that can be
        transformed to json
        """
        return {
            "id_": self.id_,
            "row": self._get_opposed(self.row, FieldCordinates.ROW)
            if reverse else self.row,
            "column": self._get_opposed(self.column, FieldCordinates.COLUMN)
            if reverse else self.column,
            "is_base": self.is_base,
        }
