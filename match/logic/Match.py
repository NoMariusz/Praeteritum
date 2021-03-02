import random
import time
from threading import Thread, Timer
from datetime import datetime
from typing import Callable, Optional
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels_redis.core import RedisChannelLayer
from cards.utlis import get_deck_cards_ids_for_player
from cards.models import CardModel
from cards.serializers import CardSerializer
from .match_modules.Board import Board
from ..constatnts import DEFAULT_BASE_POINTS, TURN_TIME, \
    TURN_STATUS_REFRESH_TIME, CARDS_DRAWED_AT_START_COUNT, \
    CARDS_DRAWED_AT_TURN_COUNT, MATCH_DELETE_TIMEOUT


class Match:
    """ store informations and managing them to enable play a match and
    communicate with sockets by sending them messages with changes of
    match state, so they recieve information immediately """

    def __init__(self, id_: int, players: list, delete_callback: Callable):
        """ :param delete_callback: Callable - function from parrent enabling
        to delete self by remove references in MatchManager """
        self.live: bool = True
        self.id_: int = id_

        self.channel_layer: Optional[RedisChannelLayer] = None
        self.match_name: str = "match%s" % self.id_

        # list of Users in match
        self.players: list = players
        # data related to players
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
            target=self._turn_timer, daemon=True)
        self._turn_timer_thread.start()

        # drawing cards
        self._draw_cards(count=CARDS_DRAWED_AT_START_COUNT, for_player=0)
        self._draw_cards(count=CARDS_DRAWED_AT_START_COUNT, for_player=1)

        # store index of winner globally to have access when sending initial
        # data
        self.winner_index = -1

        # lifecycle / deleting match
        self._delete_callback = delete_callback
        self._auto_delete_timer: Optional[Timer] = None
        self._connected_consumers_count = 0
        # start auto deleting timer, he will be cancelled when somebody
        # connect
        self._start_auto_delete_timer()

        # board
        self._board = Board(self._send_to_sockets)

    # lifecycle / deleting self stuff

    def __del__(self):
        # to defifnietly stop turn change thread
        self.live = False

    def _auto_delete(self):
        print("\tInfo: Match: Automatic deleting %s" % self)
        # to delete references in match_manager
        self._delete_callback(self)

    def _start_auto_delete_timer(self):
        """ start Timer deleting self after some time """
        self._auto_delete_timer = Timer(
            MATCH_DELETE_TIMEOUT, self._auto_delete)
        self._auto_delete_timer.daemon = True
        self._auto_delete_timer.start()

    def _cancel_auto_delete_timer(self):
        """ safe cancel timer trying to delete this object """
        if self._auto_delete_timer is not None:
            self._auto_delete_timer.cancel()
            self._auto_delete_timer = None

    # sockets / connection stuff

    def connect_socket(
            self, channel_layer: RedisChannelLayer, user: User) -> bool:
        """ connecting socket channel_layer to self so can send messages """
        if user not in self.players:
            return False

        self.channel_layer = channel_layer

        # when somebody connect cancel deleting self
        self._connected_consumers_count += 1
        self._cancel_auto_delete_timer()

        return True

    def consumer_disconnect(self):
        """ when some matchConsumer disconnect """
        self._connected_consumers_count -= 1
        # when all consumers disconnect set timer deleting self
        if (self._connected_consumers_count <= 0):
            self._start_auto_delete_timer()

    def _send_to_sockets(self, message: dict, modify=False):
        """ sending given message: dict to match sockets by channel layer,
        :param modify: bool - specify if socket should modify that message
        :param message: dict - should have keys data and name
        """
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

    def _get_opposed_index(self, player_index: int) -> int:
        return (player_index + 1) % 2

    # turns stuff

    def _turn_timer(self):
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
        # modify players basepoints
        self._modify_base_points()
        # send info to board that turn change
        self._board.on_turn_change()
        # check is someone win
        self._check_someone_win()

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
        self._send_to_sockets(message, modify=False)

    # cards related stuff

    def _get_player_cards(self, player_index: int) -> list:
        # get cards for player
        player: User = self.players[player_index]
        player_cards_ids: list = get_deck_cards_ids_for_player(player)
        # shuffle cards in deck
        random.shuffle(player_cards_ids)
        return player_cards_ids

    def _draw_cards(self, count: int, for_player: int) -> bool:
        """ move cards from deck to hand
        :param count: int - amount of cards to draw """
        player_data: dict = self._players_data[for_player]

        deck: list = player_data["deck_cards_ids"]
        hand: list = player_data["hand_cards_ids"]

        for move in range(count):
            # if deck is empty can not draw card from it
            if len(deck) <= 0:
                return False
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
            lambda id_: self._made_card_data_by_id(id_),
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
        self._send_to_sockets(message, modify=False)

    def _send_to_sockets_hand_changed(self, player_index: int):
        message = {
            'name': 'hand-cards-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_cards': self._get_cards_data(player_index)
            }
        }
        self._send_to_sockets(message, modify=True)

    # base points stuff

    def _modify_base_points(self):
        """ modify players base points depending on enemies occuping base
        count and send info when points change to sockets """
        for playerIdx in range(2):
            # get how much points player lost
            lost_points: int = self._board.get_player_lost_base_points(
                playerIdx)
            if lost_points > 0:
                self._players_data[playerIdx]['base_points'] -= lost_points
                # send info to sockets
                self._send_to_socket_base_points_changed(playerIdx)

    def _send_to_socket_base_points_changed(self, player_index: int):
        message = {
            'name': 'base-points-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_points': self._players_data[player_index]["base_points"]
            }
        }
        self._send_to_sockets(message, modify=False)

    # win/lost stuff

    def _check_someone_win(self):
        """ check if some player win and end game """
        self.winner_index: int = self._check_if_someone_win()
        # checking if someone win
        if self.winner_index != -1:
            self._send_to_socket_player_win()
            self.live = False
            # delete self after some time
            self._start_auto_delete_timer()

    def _check_if_someone_win(self) -> int:
        """ checking if one of player meet conditions to win
        :return: int - index of player who win or -1 when nobody win or -2
        when is draw """

        # check base_points

        player0_points: int = self._players_data[0]["base_points"]
        player1_points: int = self._players_data[1]["base_points"]
        if (player0_points <= 0 or player1_points <= 0):
            if player0_points == player1_points:
                return -2   # when both players lost all points
            return 0 if player0_points > player1_points else 1

        # check if someone lost all units and cards (actions)

        players_actions = [0, 0]
        for player_index in range(2):
            player_data: dict = self._players_data[player_index]
            cards_count: int = len(player_data["hand_cards_ids"]) + \
                len(player_data["deck_cards_ids"])
            units_count: int = self._board.get_units_count_for_player(
                player_index)
            players_actions[player_index] = cards_count + units_count

        # if draw, both players have no actions left
        if players_actions == [0, 0]:
            return -2

        # return -1 when nobody lost all units
        if 0 not in players_actions:
            return -1
        # when somebody lost return index of his enemy because he win
        lost_player_index: int = players_actions.index(0)
        return -1 if lost_player_index == -1 else self._get_opposed_index(
            lost_player_index)

    def _send_to_socket_player_win(self):
        """ :param winner_index: int - index of player who win, can be -2 then
        it is draw """
        message = {
            'name': 'player-win',
            'data': {
                'winner_index': self.winner_index,
            }
        }
        self._send_to_sockets(message, modify=False)

    # overall utils

    def _get_safe_player_data_dict(self, player_index: int) -> dict:
        enemy_index: int = self._get_opposed_index(player_index)

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
            }
        }

    def _run_only_when_player_has_turn(func) -> Callable:
        """ decorator allowing run only when player has turn
        function decorates should have 'player_index' kwarg """
        def wrapper(*args, **kwargs):
            # get self as first arg for func
            self = args[0]
            # get player_index requesting for action
            player_index = kwargs["player_index"]
            # if is not the player turn he can not run func
            if self.player_turn != player_index:
                return False

            return func(*args, **kwargs)
        return wrapper

    # Section with public methods returning data to sockets

    def give_initial_data(self, player_index: int) -> dict:
        # return data to prepare socket client
        player_data: dict = self._get_safe_player_data_dict(player_index)
        return {
            **player_data,
            "turn": self.player_turn,
            "fields": self._board.get_fields_dicts(player_index),
            "units": self._board.get_units_dicts(),
            'winner_index': self.winner_index,
        }

    @_run_only_when_player_has_turn
    def end_turn(self, player_index: int) -> bool:
        """ end turn for specified player by player_index """
        self._start_next_turn()
        return True

    @_run_only_when_player_has_turn
    def play_a_card(
            self, player_index: int, card_id: int, field_id: int) -> bool:
        """ try to play a card from hand to board
        :param card_id: int - card id to play
        :param field_id: int - field id to play there card
        :return: bool - whether it worked """
        # get list with cards ids in hand, and check if card in hand
        player_hand: list = self._players_data[player_index]["hand_cards_ids"]
        if card_id not in player_hand:
            return False
        # check if player can play card at that field
        if not self._board.check_if_player_can_play_card(
                player_index, field_id):
            return False

        player_hand.remove(card_id)
        self._send_to_sockets_hand_changed(player_index)
        # create and add unit to board
        card_data: dict = self._made_card_data_by_id(card_id)
        self._board.add_unit_by_card_data(card_data, player_index, field_id)
        return True

    @_run_only_when_player_has_turn
    def move_unit(
            self, player_index: int, unit_id: int, field_id: int) -> bool:
        """ delegate board to move unit
        :return: bool - if board move_unit """
        return self._board.move_unit(player_index, unit_id, field_id)

    @_run_only_when_player_has_turn
    def attack_unit(
            self, player_index: int, attacker_id: int, defender_id: int
    ) -> bool:
        """ delegate board to attack unit
        :return: bool - if board attack_unit """
        return self._board.attack_unit(player_index, attacker_id, defender_id)
