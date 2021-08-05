from .utils import calc_distance_from_fields, get_unit_by_id
from .items.Field import Field
from .items.Unit import Unit


class UnitMoveManager:
    def __init__(self, units: list[Unit], fields: list[Field]):
        """ :param units: list[Unit] - reference to list of units from parent
        :param fields: list[Field] - reference to list of fields
         """
        self._units = units
        self._fields = fields

    def move_unit(
            self, player_index: int, unit_id: int, new_field_id: int) -> bool:
        """ move unit to field if it is possible
        :param player_index: int - index of player who want to move
        :param unit_id: int - unit to move id
        :param new_field_id: int - id of field where unit want to move
        :return: bool - if the move is successful """
        # get field and unit
        unit: Unit = get_unit_by_id(unit_id, self._units)
        new_field: Field = self._fields[new_field_id]

        # check if can move unit
        if not self._check_if_can_move_unit(player_index, unit, new_field):
            return False

        old_field: Field = self._fields[unit.field_id]
        # calculate distance before move
        distance: int = calc_distance_from_fields(
            old_field, new_field)
        # delete unit from old field
        old_field.unit = None
        # add unit to new field
        new_field.unit = unit
        unit.field_id = new_field.id_
        # change unit move_points after move
        unit.move_points -= distance

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
        distance: int = calc_distance_from_fields(
            old_field, new_field)
        if distance > unit.move_points:
            return False

        return True
