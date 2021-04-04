from playerdata.models import PlayerData
from cards.models import CardModel


def make_player_data(user):
    # init userdata
    playerdata = PlayerData(user=user)
    playerdata.save()

    # add base cards collection
    base_collection = CardModel.objects.filter(
        defaultInCollection=True)
    playerdata.collection.set(base_collection)

    # add base cards deck
    base_deck = CardModel.objects.filter(
        defaultInDeck=True)
    playerdata.deck.set(base_deck)
