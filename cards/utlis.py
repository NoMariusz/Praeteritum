from django.contrib.auth.models import User
from playerdata.models import PlayerData
from .models import CardModel


def get_deck_cards_ids_for_player(player: User) -> list:
    """ return list of ids cards in player deck """
    player_data: PlayerData = player.playerdata
    cards: list = player_data.deck.all()
    cards_ids: list = list(map(
        lambda card: card.id, list(cards)
    ))
    return cards_ids


def get_card_by_id(id_: int) -> CardModel:
    return CardModel.objects.get(id=id_)
