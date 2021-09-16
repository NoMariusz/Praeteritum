from match.logic.match_modules.board.UnitMoveManager import UnitMoveManager
from match.logic.match_modules.board.UnitAttackManager import UnitAttackManager
from typing import Callable, Optional
from .items.Field import Field
from .items.Unit import Unit


class UnitsManager:
    def __init__(self, send_to_sockets: Callable, fields: list[Field]):
        """ :param send_to_sockets: Callable - function from parent who enable
        sending messages to sockets from here
        :param fields: list[Field] - list of fields from parent """
        # _units is list of Unit ordered by id
        self._units: list[Unit] = []
        self._unit_id_counter = 0

        self._send_to_sockets: Callable = send_to_sockets
        self._fields = fields

        self._unit_attack_manager = UnitAttackManager(
            self._units, self._fields)
        self._unit_move_manager = UnitMoveManager(self._units, self._fields)

    def on_turn_change(self, player_with_turn_idx):
        """ make all actions necessary for board when turn change """
        # restore units points when start their turn
        for unit in self._units:
            if unit.owner_index == player_with_turn_idx:
                unit.attack = unit.max_attack
                unit.energy = unit.max_energy
                unit.attack_range = unit.max_attack_range

        self._send_to_sockets_units_changed()

    # managing units

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

    def get_units_dicts(self) -> list:
        """ :return: list - contains dicts with jsonable units data """
        return list(map(
            lambda unit: unit.get_data_for_frontend(), self._units))

    def get_units_count_for_player(self, player_index: int) -> int:
        """ calculate how many is units that belong to player with given index
        """
        player_units = list(filter(
            lambda unit:
                unit.owner_index == player_index and unit.is_live, self._units
        ))
        return len(player_units)

    def get_unit_by_id(self, unit_id: int) -> Optional[Unit]:
        # get cards with given id collection
        results = [unit for unit in self._units if unit.id_ == unit_id]
        return results[0] if len(results) > 0 else None

    def _send_to_sockets_units_changed(self):
        """ sending message to sockets with new units """
        message = {
            'name': 'units-changed',
            'data': {
                'units': self.get_units_dicts()
            }
        }
        self._send_to_sockets(message)

    # units move

    def move_unit(
            self, *params) -> bool:
        """ move unit to field
        :param player_index: int - index of player who want to move
        :param unit_id: int - unit to move id
        :param new_field_id: int - id of field where unit want to move
        :return: bool - if the move is successful """
        # delegate manager to do this
        result = self._unit_move_manager.move_unit(*params)
        # end work if result is false
        if not result:
            return False

        # send info to socket that unit data changed
        self._send_to_sockets_units_changed()

        return True

    # units attack

    def attack_unit(
            self, *params
    ) -> bool:
        """ make attack between units
        :param player_index: int - index of player who attack
        :param attacker_id: int - id of unit that attack
        :param defender_id: int - id of unit which are attacked
        :return: bool - if attacking success (if unit attack other) """
        # delegate manager to do this
        result = self._unit_attack_manager.attack_unit(*params)
        # end when can not attack
        if not result:
            return False

        # delete died units
        self._clear_died_units()

        # send info to socket that unit data changed
        self._send_to_sockets_units_changed()

        return True

    def _clear_died_units(self):
        """ safely deletes all died units (such that with health <= 0) """
        died_units: list = [u for u in self._units if u.hp <= 0]
        for unit in died_units:
            # delete unit from fields
            field = self._fields[unit.field_id]
            field.unit = None
            # set that unit is dead
            unit.is_live = False
