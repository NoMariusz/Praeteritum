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
        self.unit = None

    def get_data_for_frontend(self, for_player: int) -> dict:
        """ :return: dict - contain data for frontend in dict that can be
        transformed to json
        """
        return {
            "id": self.id_,
            "row": self.row,
            "column": self.column,
            "is_base": self.is_base,
            "in_player_half": self.player_half == for_player,
        }
