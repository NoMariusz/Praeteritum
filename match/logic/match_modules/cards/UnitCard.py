from cards.models import CardModel
from .CardAbstract import CardAbstract
from ..board.items.Unit import Unit


class UnitCard(CardAbstract):
    def __init__(self, id_: int, card_object: CardModel):
        super().__init__(id_, card_object)

    def play(self) -> Unit:
        # TODO: to implement
        pass

    def __str__(self) -> str:
        return super().__str__()
