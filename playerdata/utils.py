from asgiref.sync import sync_to_async
from playerdata.models import PlayerData
from cards.models import CardModel


async def make_player_data(user):
    # init userdata
    playerdata = PlayerData(user=user)
    await sync_to_async(playerdata.save)()

    # add base cards collection
    base_collection = await sync_to_async(CardModel.objects.filter)(
        defaultInCollection=True)
    sync_to_async(playerdata.collection.set)(base_collection)

    # add base cards deck
    base_deck = await sync_to_async(CardModel.objects.filter)(defaultInDeck=True)
    sync_to_async(playerdata.deck.set)(base_deck)
