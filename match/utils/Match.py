import random


class Match:
    def __init__(self, _id, players):
        self.channel_layer = None
        self.match_id = _id
        self.players = players
        self.player_turn = random.randint(0, 1)

    def connect_socket(self, channel_layer, user):
        if user not in self.players:
            return False
        self.channel_layer = channel_layer
        return True
