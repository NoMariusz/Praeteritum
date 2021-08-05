from cards.models import CardModel
from .CardAbstract import CardAbstract


class UnitCard(CardAbstract):
    def __init__(self, id_: int, card_object: CardModel):
        super().__init__(id_, card_object)

    def __str__(self) -> str:
        return super().__str__()
