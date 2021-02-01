import random


class Match:
    def __init__(self, id_, players):
        self.channel_layer = None
        self.id_ = id_
        self.players = players
        self.turn = random.randint(0, 1)

    def connect_socket(self, channel_layer, user):
        if user not in self.players:
            return False
        self.channel_layer = channel_layer
        return True
