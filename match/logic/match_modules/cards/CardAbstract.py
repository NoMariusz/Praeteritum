import abc

from cards.models import CardModel
from ..board.items.Unit import Unit


class CardAbstract(metaclass=abc.ABCMeta):
    """ Abstract class defining card at match """

    def __init__(self, id_: int, card_object: CardModel):
        self.id: int = id_
        self.db_model_id: int = card_object.id
        self.name: str = card_object.name
        self.category: int = card_object.category
        self.rarity: int = card_object.rarity
        self.attack: int = card_object.attack
        self.hp: int = card_object.hp
        self.image: str = card_object.image
        self.kind: int = card_object.kind

    @abc.abstractmethod
    def play(self) -> bool or Unit:
        raise NotImplementedError

    def __str__(self) -> str:
        return "<%s id: %s, db_model_id: %s, name: %s, hp: %s, attack: %s/>" \
            % (
                self.__class__, self.id, self.db_model_id, self.name, self.hp,
                self.attack)
