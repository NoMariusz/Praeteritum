from math import floor
from ....constants import ONLY_ATTACKER_CAT
from .utils import calc_attack_multiplier, calc_distance_from_fields, \
    get_unit_by_id
from .items.Field import Field
from .items.Unit import Unit


class UnitAttackManager:
    def __init__(self, units: list[Unit], fields: list[Field]):
        """ :param units: list[Unit] - reference to list of units from parent
        :param fields: list[Field] - reference to list of fields
         """
        self._units = units
        self._fields = fields

    def attack_unit(
            self, player_index: int, attacker_id: int, defender_id: int
    ) -> bool:
        """ attack other unit and simulate battle by attacking one another
        :param player_index: int - index of player who attack
        :param attacker_id: int - id of unit that attack
        :param defender_id: int - id of unit which are attacked
        :return: bool - if attacking success (if unit attack other) """
        attacker: Unit = get_unit_by_id(attacker_id, self._units)
        defender: Unit = get_unit_by_id(defender_id, self._units)

        # check if unit can attack other
        if not self._check_if_unit_can_attack(
                player_index, attacker, defender):
            return False

        # make attacks between units
        self._made_attack(attacker, defender, True)
        self._made_attack(defender, attacker, False)

        # change attacker statistics
        attacker.energy -= 1

        return True

    def _check_if_unit_can_attack(
            self, player_index: int, attacker: Unit, defender: Unit
    ) -> bool:
        """ check if attacker Unit can attack defender Unit
        :return: bool - if can attack """
        # both must be live
        if not(attacker.is_live and defender.is_live):
            return False

        # if player try to attack by not his unit
        if attacker.owner_index != player_index:
            return False

        # if player try attack his unit
        if attacker.owner_index == defender.owner_index:
            return False

        # if attacker not have range
        attacker_field: Field = self._fields[attacker.field_id]
        defender_field: Field = self._fields[defender.field_id]
        distance: int = calc_distance_from_fields(
            attacker_field, defender_field)
        if distance > attacker.attack_range:
            return False

        # if attacker not have attack points
        if attacker.energy <= 0:
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
        distance: int = calc_distance_from_fields(
            dealer_field, taken_field)
        if distance > damage_dealer.attack_range:
            return False

        # check if type can attack not as attacker
        if not as_attacker and damage_dealer.category == ONLY_ATTACKER_CAT:
            return False

        # made attack
        multiplier: float = calc_attack_multiplier(
            damage_dealer, damage_taken)
        attack_power: int = floor(damage_dealer.attack * multiplier)
        damage_taken.hp -= attack_power

        return True
