from praeteritum.utils.Delegator import Delegator
from match.logic.match_modules.board.UnitsManager import UnitsManager
from typing import Callable
from .utils import make_fields
from .items.Field import Field
from .items.Unit import Unit


class Board(Delegator):
    def __init__(self, send_to_sockets: Callable):
        """ :param send_to_sockets: Callable - function from parent who enable
        sending messages to sockets from board """
        # _fields is list of Field ordered by id
        self._fields: list = make_fields()

        self._units_manager = UnitsManager(send_to_sockets, self._fields)
        self._units = self._units_manager._units

        # automaticaly delegate managers functions to self
        self._delegate_subsystems = [self._units_manager]
        super().__init__()

    def on_turn_change(self):
        """ make all actions necessary for board when turn change """
        self._units_manager.on_turn_change()

    # fields

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

    # base points

    def get_player_lost_base_points(self, player_index: int) -> int:
        """ calculate how many enemy units are on player base now
        :return: int - how many base points player lost """
        lost_base_points = 0
        for field in self._fields:
            # if Field is part of player base
            if field.is_base and field.player_half == player_index:
                unit_in_field: Unit = field.unit
                # if is Unit on Field and is enemy
                if (unit_in_field is not None
                        and unit_in_field.owner_index != player_index):
                    lost_base_points += 1
        return lost_base_points
