import random
import time
from threading import Thread
from datetime import datetime
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels_redis.core import RedisChannelLayer
from cards.utlis import get_deck_cards_ids_for_player
from cards.models import CardModel
from cards.serializers import CardSerializer
from ..constatnts import DEFAULT_BASE_POINTS, TURN_TIME, \
    TURN_STATUS_REFRESH_TIME, CARDS_DRAWED_AT_START_COUNT, \
    CARDS_DRAWED_AT_TURN_COUNT


class Match:
    def __init__(self, id_: int, players: list):
        self.live: bool = True
        self.id_: int = id_

        self.channel_layer: RedisChannelLayer = None
        self.match_name: str = "match%s" % self.id_

        # list of Users in match
        self.players: list = players
        # data related players
        self._players_data: list = [
            {
                "username": players[0].username,
                "base_points": DEFAULT_BASE_POINTS,
                "hand_cards_ids": [],
                "deck_cards_ids": self._get_player_cards(0),
            },
            {
                "username": players[1].username,
                "base_points": DEFAULT_BASE_POINTS,
                "hand_cards_ids": [],
                "deck_cards_ids": self._get_player_cards(1),
            },
        ]

        # turns related stuff
        self.player_turn: int = random.randint(0, 1)
        self.turn_progress: float = 0
        self._last_turn_start_time: datetime = datetime.now()

        # start thread with timer to change turn
        self._turn_timer_thread: Thread = Thread(
            target=self._start_turn_timer_loop, daemon=True)
        self._turn_timer_thread.start()

        # drawing cards
        self._draw_cards(count=CARDS_DRAWED_AT_START_COUNT, for_player=0)
        self._draw_cards(count=CARDS_DRAWED_AT_START_COUNT, for_player=1)

    def __del__(self):
        # to stop thread
        self.live = False

    # sockets stuff
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
                self._start_next_turn()

            self._send_progress_changed()

    def _start_next_turn(self):
        # set next turn
        self._set_next_turn()
        self.turn_progress = 0
        self._last_turn_start_time = datetime.now()
        # draw card for player who start his turn now
        self._draw_cards(
            count=CARDS_DRAWED_AT_TURN_COUNT, for_player=self.player_turn)

    def _set_next_turn(self):
        self.player_turn = 1 if self.player_turn == 0 else 0
        self._send_to_sockets_turn_change()

    def _send_progress_changed(self):
        message = {
            'name': 'turn-progress-changed',
            'data': {
                'progress': self.turn_progress
            }
        }
        self._send_to_sockets(message, modify=False)

    def _send_to_sockets_turn_change(self):
        message = {
            'name': 'turn-changed',
            'data': {
                'turn': self.player_turn
            }
        }
        self._send_to_sockets(message, modify=True)

    # cards related stuff
    def _get_player_cards(self, player_index: int) -> list:
        # get cards for player
        player: User = self.players[player_index]
        player_cards_ids: list = get_deck_cards_ids_for_player(player)
        # shuffle cards in deck
        random.shuffle(player_cards_ids)
        return player_cards_ids

    def _draw_cards(self, count: int, for_player: int) -> bool:
        # move cards from deck to hand cunt: int times, for specified plauer
        player_data: dict = self._players_data[for_player]

        deck: list = player_data["deck_cards_ids"]
        hand: list = player_data["hand_cards_ids"]
        # if deck is empty can not draw card from it
        if len(deck) <= 0:
            return False

        for move in range(count):
            card_id: int = deck.pop()
            hand.append(card_id)

        self._send_to_sockets_decks_cards_count_changed(for_player)
        self._send_to_sockets_hand_changed(for_player)
        return True

    def _made_card_data_by_id(self, card_id: int) -> dict:
        """ Get card object by given card_id, then made from that card data
        dict friendly for fronend """
        card: CardModel = CardModel.objects.get(id=card_id)
        card_serializer: CardSerializer = CardSerializer(card)
        return card_serializer.data

    def _get_cards_data(self, player_index: int) -> list:
        """ Get list of cards objects for specified player """
        player_data: dict = self._players_data[player_index]
        cards_data: list = list(map(
            lambda id_: self. _made_card_data_by_id(id_),
            player_data["hand_cards_ids"]))
        return cards_data

    def _send_to_sockets_decks_cards_count_changed(self, player_index: int):
        player_data: dict = self._players_data[player_index]
        message = {
            'name': 'deck-cards-count-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_count': len(player_data["deck_cards_ids"])
            }
        }
        self._send_to_sockets(message, modify=True)

    def _send_to_sockets_hand_changed(self, player_index: int):
        message = {
            'name': 'hand-cards-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_cards': self._get_cards_data(player_index)
            }
        }
        self._send_to_sockets(message, modify=True)

    # overall utils
    def _get_safe_player_data_dict(self, player_index: int) -> dict:
        enemy_index: int = self.get_enemy_index(player_index)

        player_data: dict = self._players_data[player_index]
        enemy_data: dict = self._players_data[enemy_index]
        return {
            "players_data": {
                "player": {
                    "username": player_data["username"],
                    "base_points": player_data["base_points"],
                    "deck_cards_count": len(player_data["deck_cards_ids"]),
                    "hand_cards": self._get_cards_data(player_index)
                },
                "enemy": {
                    "username": enemy_data["username"],
                    "base_points": enemy_data["base_points"],
                    "deck_cards_count": len(enemy_data["deck_cards_ids"]),
                    "hand_cards_count": len(enemy_data["hand_cards_ids"])
                }
            },
            "has_turn": self.player_turn == player_index
        }

    """ Section with public methods returning data to sockets """
    def give_initial_data(self, player_index: int) -> dict:
        # return data to prepare socket client
        return self._get_safe_player_data_dict(player_index)

    def end_turn(self, player_index: int) -> bool:
        """ end turn for specified player by player_index """
        # if is not the player turn he can not end turn
        if self.player_turn != player_index:
            return False

        self._start_next_turn()
        return True
