import threading
from cards.models import CardModel
from playerdata.models import PlayerData


def startUserDataThread(user):
    thread = threading.Thread(target=makePlayerData, args=(user,))
    thread.start()


def makePlayerData(user):
    # init userdata
    playerdata = PlayerData(user=user)
    playerdata.save()

    # add base cards collection
    base_collection = CardModel.objects.filter(defaultInCollection=True)
    playerdata.collection.set(base_collection)

    # add base cards deck
    base_deck = CardModel.objects.filter(defaultInDeck=True)
    playerdata.deck.set(base_deck)
