from math import floor
from typing import Callable, Optional
from ...constants import BOARD_COLUMNS, BOARD_ROWS, BASE_FIELDS_IDS, \
    DEFAULT_MOVE_POINTS, DEFAULT_ATTACK_POINTS, STRONG_AGAINST_CAT_TO_CAT, \
    WEAK_AGAINST_CAT_TO_CAT, ONLY_ATTACKER_CAT
from .board_items.Field import Field
from .board_items.Unit import Unit


class Board():
    def __init__(self, send_to_sockets: Callable):
        """ :param send_to_sockets: Callable - function from parent who enable
        sending messages to sockets from board """
        # _fields is list of Field ordered by id
        self._fields: list = self._make_fields()
        # _units is list of Unit ordered by id
        self._units = []
        self._unit_id_counter = 0
        self._send_to_sockets: Callable = send_to_sockets

    def on_turn_change(self):
        """ make all actions necessary for board when turn change """
        # restore units move points
        for unit in self._units:
            unit.move_points = DEFAULT_MOVE_POINTS
            unit.attack_points = DEFAULT_ATTACK_POINTS

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
        return list(map(
            lambda unit: unit.get_data_for_frontend(), self._units))

    def get_units_count_for_player(self, player_index: int) -> int:
        """ calculate how many is units that belong to player with given index
        """
        player_units = list(filter(
            lambda unit: unit.owner_index == player_index, self._units))
        return len(player_units)

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
            self, player_index: int, unit_id: int, new_field_id: int) -> bool:
        """ try to move unit to field
        :return: bool - if the move is successful """
        # get field and unit
        unit: Unit = self._get_unit_by_id(unit_id)
        new_field: Field = self._fields[new_field_id]

        # check if can move unit
        if not self._check_if_can_move_unit(player_index, unit, new_field):
            return False

        old_field: Field = self._fields[unit.field_id]
        # calculate distance before move
        distance: int = self._calc_distance_from_fields(
            old_field, new_field)
        # delete unit from old field
        old_field.unit = None
        # add unit to new field
        new_field.unit = unit
        unit.field_id = new_field.id_
        # change unit move_points after move
        unit.move_points -= distance

        # send info to socket that unit data changed
        self._send_to_sockets_units_changed()

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

        # if unit have enough move_points
        old_field: Field = self._fields[unit.field_id]
        distance: int = self._calc_distance_from_fields(
            old_field, new_field)
        if distance > unit.move_points:
            return False

        return True

    # units attack

    def attack_unit(
            self, player_index: int, attacker_id: int, defender_id: int
    ) -> bool:
        """ attack other unit and simulate battle by attacking one another
        :param player_index: int - index of player who attack
        :param attacker_id: int - id of unit that attack
        :param defender_id: int - id of unit which are attacked
        :return: bool - if attacking success (if unit attack other) """
        attacker: Unit = self._get_unit_by_id(attacker_id)
        defender: Unit = self._get_unit_by_id(defender_id)

        # check if unit can attack other
        if not self._check_if_unit_can_attack(
                player_index, attacker, defender):
            return False

        # make attacks between units
        self._made_attack(attacker, defender, True)
        self._made_attack(defender, attacker, False)

        # change attacker statistics
        attacker.attack_points -= 1

        # delete died units
        self._clear_died_units()

        # send info to socket that unit data changed
        self._send_to_sockets_units_changed()

        return True

    def _check_if_unit_can_attack(
            self, player_index: int, attacker: Unit, defender: Unit
    ) -> bool:
        """ check if attacker Unit can attack defender Unit
        :return: bool - if can attack """
        # if player try to attack by not his unit
        if attacker.owner_index != player_index:
            return False

        # if player try attack his unit
        if attacker.owner_index == defender.owner_index:
            return False

        # if attacker not have range
        attacker_field: Field = self._fields[attacker.field_id]
        defender_field: Field = self._fields[defender.field_id]
        distance: int = self._calc_distance_from_fields(
            attacker_field, defender_field)
        if distance > attacker.attack_range:
            return False

        # if attacker not have attack points
        if attacker.attack_points <= 0:
            return False

        return True

    def _made_attack(
            self, damage_dealer: Unit, damage_taken: Unit, as_attacker: bool
    ) -> bool:
        """ made single attack where only defender get damage if attacker can
        attack him
        :return: bool - if attack success """
        # check if attacker have range
        dealer_field: Field = self._fields[damage_dealer.field_id]
        taken_field: Field = self._fields[damage_taken.field_id]
        distance: int = self._calc_distance_from_fields(
            dealer_field, taken_field)
        if distance > damage_dealer.attack_range:
            return False

        # check if type can attack not as attacker
        if not as_attacker and damage_dealer.category == ONLY_ATTACKER_CAT:
            return False

        # made attack
        multiplier: float = self._calc_attack_multiplier(
            damage_dealer, damage_taken)
        attack_power: int = floor(damage_dealer.attack * multiplier)
        damage_taken.hp -= attack_power

        return True

    def _clear_died_units(self):
        """ safely deletes all died units (such that with health <= 0) """
        died_units: list = [u for u in self._units if u.hp <= 0]
        for unit in died_units:
            # delete units from fields
            field = self._fields[unit.field_id]
            field.unit = None
            # remove from units
            self._units.remove(unit)

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

    # utils

    def _get_unit_by_id(self, unit_id: int) -> Optional[Unit]:
        """ try to find unit with given id
        :return: Unit or None - found or not unit """
        matches = [u for u in self._units if u.id_ == unit_id]
        if len(matches) <= 0:
            return None
        return matches[0]

    @staticmethod
    def _calc_distance_from_fields(old_field: Field, new_field: Field) -> int:
        """ calculate how far is field from field """
        distance: int = (abs(old_field.column - new_field.column)
                         + abs(old_field.row - new_field.row))
        return distance

    @staticmethod
    def _calc_attack_multiplier(attacker: Unit, defender: Unit) -> float:
        """ calculate bonus multiplayier for given units """
        # if attacker is strong against defender
        if STRONG_AGAINST_CAT_TO_CAT[attacker.category] == defender.category:
            return 2
        # if attacker is weak against defender
        if WEAK_AGAINST_CAT_TO_CAT[attacker.category] == defender.category:
            return 0.5
        return 1
