import random
import time
from threading import Thread
from datetime import datetime
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels_redis.core import RedisChannelLayer
from ..constatnts import DEFAULT_BASE_POINTS, TURN_TIME, \
    TURN_STATUS_REFRESH_TIME


class Match:
    def __init__(self, id_: int, players: list):
        self.live: bool = True
        self.id_: int = id_

        self.channel_layer: RedisChannelLayer = None
        self.match_name: str = "match%s" % self.id_

        # list of Users in match
        self.players: list = players
        self.players_data: list = [
            {"username": players[0].username,
                "base_points": DEFAULT_BASE_POINTS},
            {"username": players[1].username,
                "base_points": DEFAULT_BASE_POINTS},
        ]
        self.player_turn: int = random.randint(0, 1)
        self.turn_progress: float = 0
        self._last_turn_start_time: datetime = datetime.now()

        # start thread with timer to change turn
        self.turn_timer_thread: Thread = Thread(
            target=self._start_turn_timer_loop, daemon=True)
        self.turn_timer_thread.start()

    def __del__(self):
        # to stop thread
        self.live = False

    def connect_socket(
            self, channel_layer: RedisChannelLayer, user: User) -> bool:
        if user not in self.players:
            return False
        self.channel_layer = channel_layer
        return True

    def _send_to_sockets(self, message: dict, modify=False):
        """ sending given message: dict to match sockets by channel layer,
        param :modify specify if socket should modify that message
        param: message: dict should have keys data and name"""
        # check if channel layer is set, function only can run properly if yes
        if self.channel_layer is None:
            print("\tInfo: Match: Try to send to sokets, but channel_layer" +
                  " is not set")
            return False

        message_type = 'send_to_socket_and_modify_message' \
            if modify else 'send_to_socket'
        async_to_sync(self.channel_layer.group_send)(
            self.match_name,
            {
                'type': message_type,
                'message': message
            }
        )

    # player index stuff
    def get_player_index_by_name(self, username: str) -> int:
        for i, player in enumerate(self.players):
            if player.username == username:
                return i
        return -1

    def get_enemy_index(self, player_index: int) -> int:
        return (player_index + 1) % 2

    # turns stuff
    def _start_turn_timer_loop(self):
        while self.live:
            # sleep task
            time.sleep(TURN_STATUS_REFRESH_TIME)
            # get how much time passes
            now: datetime = datetime.now()
            seconds_from_start: int = (
                now - self._last_turn_start_time).seconds
            # update progress
            self.turn_progress = seconds_from_start / TURN_TIME * 100

            if self.turn_progress >= 100:
                self._set_next_turn()
                self.turn_progress = 0
                self._last_turn_start_time = datetime.now()

            self._send_progress_changed()

    def _set_next_turn(self):
        self.player_turn = 1 if self.player_turn == 0 else 0
        self._send_to_sockets_turn_change()

    def _send_progress_changed(self):
        message = {
            'name': 'turn_progress_changed',
            'data': {
                'progress': self.turn_progress
            }
        }
        self._send_to_sockets(message, modify=False)

    def _send_to_sockets_turn_change(self):
        message = {
            'name': 'turn_changed',
            'data': {
                'turn': self.player_turn
            }
        }
        self._send_to_sockets(message, modify=True)

    # return data to prepare socket client
    def give_initial_data(self, player_index: int) -> dict:
        return {
            "players_data": {
                "player": self.players_data[player_index],
                "enemy": self.players_data[self.get_enemy_index(player_index)]
            },
            "has_turn": self.player_turn == player_index
        }
