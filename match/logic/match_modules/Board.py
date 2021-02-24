from typing import Callable
from ...constatnts import BOARD_COLUMNS, BOARD_ROWS, BASE_FIELDS_IDS
from .Field import Field
from .Unit import Unit


class Board():
    def __init__(self, send_to_sockets: Callable):
        """ :param sent_to_socket: Callable - function from parent who enable
        sending messages to sockets from board """
        # fields is list of Field ordered by id
        self._fields: list = self._make_fields()
        self._units = []
        self._unit_id_counter = 0
        self._send_to_sockets: Callable = send_to_sockets

    # fields

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
            lambda field: field.get_data_for_frontend(for_player),
            self._fields[::-1] if reverse else self._fields))

    # units

    def _create_new_unit(
            self, card_data: dict, for_player: int, at_field: int) -> Unit:
        """ Create unit by card_data and return them """
        unit = Unit(self._unit_id_counter, for_player, at_field, **card_data)
        return unit

    def add_unit_by_card_data(
            self, card_data: dict, for_player: int, field_id: int) -> int:
        """ create unit by card_data and add them to self._units
        :param card_data: dict - data to create unit by them
        :param for_player: int - which player play a card
        :return: int - id of new created unit
        """
        # made unit
        unit: Unit = self._create_new_unit(card_data, for_player, field_id)
        self._units.append(unit)
        self._unit_id_counter += 1
        # append unit to its field
        field: Field = self._fields[field_id]
        field.unit = unit
        # send info with new units to sockets
        self._send_to_sockets_units_changed()

        return unit.id_

    def check_if_player_can_play_card(
            self, player_index: int, field_id: int) -> bool:
        """ check if player can play card at specified field """
        field: Field = self._fields[field_id]
        # check if player play at base
        if not field.is_base or field.player_half != player_index:
            return False
        # check if is unit there
        if field.unit is not None:
            return False
        return True

    def get_units_dicts(self) -> list:
        """ :return: list - contains dicts with jsonable units data """
        return list(
            map(lambda unit: unit.get_data_for_frontend(), self._units))

    def _send_to_sockets_units_changed(self):
        """ sending message to sockets with new units """
        message = {
            'name': 'units-changed',
            'data': {
                'units': self.get_units_dicts()
            }
        }
        self._send_to_sockets(message)

    def _send_to_sockets_unit_changed(self, unit: Unit):
        """ sending message to sockets with changed unit """
        message = {
            'name': 'unit-changed',
            'data': {
                'unit': unit.get_data_for_frontend()
            }
        }
        self._send_to_sockets(message)

    # units move

    def move_unit(
            self, player_index: int, unit_id: int, new_field_id: int) -> bool:
        """ try to move unit to field
        :return: bool - if the move is successful """
        # get field and unit
        unit: Unit = self._units[unit_id]
        new_field: Field = self._fields[new_field_id]

        # check if can move unit
        if not self._check_if_can_move_unit(player_index, unit, new_field):
            return False

        # delete unit from old field
        old_field: Field = self._fields[unit.field_id]
        old_field.unit = None
        # add unit to new field
        new_field.unit = unit
        unit.field_id = new_field.id_

        # send info to socket that data (field_id) changed in unit
        self._send_to_sockets_unit_changed(unit)

        return True

    def _check_if_can_move_unit(
            self, player_index: int, unit: Unit, new_field: Field) -> bool:
        """ checking if unit can be moved at that field
        :return: bool - if can move """
        # check if field is occupied by other unit
        if new_field.unit is not None:
            return False

        # if player try to move not his unit
        if unit.owner_index != player_index:
            return False

        return True
