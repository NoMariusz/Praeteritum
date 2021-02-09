import random
from ..constatnts import DEFAULT_BASE_POINTS


class Match:
    def __init__(self, id_, players):
        self.id_ = id_

        self.channel_layer = None
        self.match_name = "match%s" % self.id_

        self.players = players
        self.players_data = [
            {"username": players[0].username,
                "base_points": DEFAULT_BASE_POINTS},
            {"username": players[1].username,
                "base_points": DEFAULT_BASE_POINTS},
        ]
        self.player_turn = random.randint(0, 1)

    def connect_socket(self, channel_layer, user):
        if user not in self.players:
            return False
        self.channel_layer = channel_layer
        return True

    # player index stuff
    def get_player_index_by_name(self, username):
        for i, player in enumerate(self.players):
            if (player.username == username):
                return i
        return -1

    def _get_enemy_index(self, player_index):
        return (player_index + 1) % 2

    # return data to prepare socket client
    def give_initial_data(self, player_index):
        return {
            "players_data": {
                "player": self.players_data[player_index],
                "enemy": self.players_data[self._get_enemy_index(player_index)]
            },
            "has_turn": self.player_turn == player_index
        }
