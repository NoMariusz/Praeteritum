from match.constants import DEFAULT_ENERGY, DEFAULT_ENERGY_AT_START, \
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
        self.category = category
        self.image = image

        # how much damage unit can deal
        self.attack = attack
        self.max_attack = attack
        # number of damage that unit can absorb before die
        self.hp = hp
        self.max_hp = hp
        # points determining how far unit can move and how many times can
        # attack
        self.energy = DEFAULT_ENERGY_AT_START
        self.max_energy = DEFAULT_ENERGY
        # tell how much away enemies can attack
        self.attack_range = ATACK_RANGE_FOR_TYPES[self.category]
        self.max_attack_range = ATACK_RANGE_FOR_TYPES[self.category]

        self.is_live = True

    def get_data_for_frontend(self) -> dict:
        """ :return: dict - contain data for frontend in dict that can be
        transformed to json
        """
        return {
            "id": self.id_,
            "owner": self.owner_index,
            "field_id": self.field_id,
            "name": self.name,
            "image": self.image,
            "category": self.category,
            "is_live": self.is_live,
            "attack": self.attack,
            "max_attack": self.max_attack,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "energy": self.energy,
            "max_energy": self.max_energy,
            "attack_range": self.attack_range,
            "max_attack_range": self.max_attack_range,
        }
