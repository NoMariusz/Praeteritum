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

    # player index stuff
    def get_player_index_by_name(self, username):
        for i, player in enumerate(self.players):
            if (player.username == username):
                return i
        return -1

    def get_enemy_index(self, player_index):
        return (player_index + 1) % 2

    def get_initial_data(self, player_index):
        players = list(map(
            lambda player: player.username, self.players))
        return {"players": {
            "player": players[player_index],
            "enemy": players[self.get_enemy_index(player_index)]
        }}
