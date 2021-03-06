from match.constants import DEFAULT_MOVE_POINTS, DEFAULT_ATTACK_POINTS, \
    ATACK_RANGE_FOR_TYPES


class Unit:
    def __init__(
            self, id_: int, owner_index: int, field_id: int, name: str,
            hp: int, attack: int, category: int, image: str, *args, **kwargs):
        """
        :param id_: int - id given by parent
        :param owner_index: int - index of player which have that unit
        :param field_id: int - id of the field where the unit is
        :param category: int - represent what type is card e.g. Missleman
        """
        self.id_ = id_
        self.owner_index = owner_index
        self.field_id = field_id
        self.name = name
        self.hp = hp
        self.attack = attack
        self.category = category
        self.image = image
        # points determining how far unit can move
        self.move_points = DEFAULT_MOVE_POINTS
        self.attack_points = DEFAULT_ATTACK_POINTS
        self.attack_range = ATACK_RANGE_FOR_TYPES[self.category]

    def get_data_for_frontend(self) -> dict:
        """ :return: dict - contain data for frontend in dict that can be
        transformed to json
        """
        return {
            "id": self.id_,
            "owner": self.owner_index,
            "field_id": self.field_id,
            "name": self.name,
            "hp": self.hp,
            "attack": self.attack,
            "category": self.category,
            "image": self.image,
            "move_points": self.move_points,
            "attack_points": self.attack_points,
            "attack_range": self.attack_range,
        }
