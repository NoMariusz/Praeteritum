import random


class Match:
    def __init__(self, _id, players):
        self.match_id = _id
        self.players = players
        self.player_turn = random.randint(0, 1)
