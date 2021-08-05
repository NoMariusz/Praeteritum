from typing import Optional

from cards.models import CardModel
from .CardAbstract import CardAbstract
from .UnitCard import UnitCard


class CardFactory:
    """ Factory responsible for creating cards """
    card_id_counter = 0

    @classmethod
    def make_card(cls, card_id: int) -> CardAbstract:
        card_object: CardModel = cls.get_card_object(card_id)

        card: Optional[CardAbstract] = None

        if card_object.kind == CardModel.CardKinds.UNIT:
            card = UnitCard(cls.card_id_counter, card_object)
        else:
            raise NotImplementedError

        cls.card_id_counter += 1

        return card

    @classmethod
    def get_card_object(cls, card_id: int) -> CardModel:
        return CardModel.objects.get(id=card_id)
