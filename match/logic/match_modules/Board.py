from ...constatnts import BOARD_COLUMNS, BOARD_ROWS, BASE_FIELDS_IDS
from .Field import Field


class Board():
    def __init__(self):
        # fields is list of Field ordered by id
        self.fields: list = self._make_fields()
        self.units = []

    def _make_fields(self) -> list:
        """ function making suitable fields objects for board and returning
        list of that fields sorted in id order """
        fields = []
        fields_count: int = BOARD_ROWS * BOARD_COLUMNS
        for field_id in range(fields_count):
            row: int = field_id // BOARD_ROWS
            column: int = field_id % BOARD_COLUMNS
            is_base: bool = field_id in BASE_FIELDS_IDS
            # plyer_half specify near which player is field, fields with
            # smaller id are near player 0, and fields with bigger id are
            # near player 1
            player_half: int = 1 if row > BOARD_ROWS / 2 else 0

            field = Field(field_id, row, column, is_base, player_half)
            fields.append(field)
        return fields

    def get_fields_dicts(self, for_player: int) -> list:
        """
        :param for_player: int - index of player for which fields should be
        ordered to render board in frontend facing that player
        :return: list - contain dicts for fronend with fields data
        """
        reverse = for_player != 0

        return list(map(
            lambda field: field.get_data_for_frontend(),
            self.fields[::-1] if reverse else self.fields))
