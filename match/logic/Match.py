from typing import Callable, Optional
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels_redis.core import RedisChannelLayer

from .utils import run_only_when_player_has_turn, get_opposed_index
from .match_modules.board.Board import Board
from .match_modules.TurnManager import TurnManager
from .match_modules.cards.CardsManager import CardsManager
from .match_modules.cards.CardPlayer import CardPlayer
from .match_modules.MatchDeleter import MatchDeleter
from .DbInformationManager import DbInformationManager
from ..constants import DEFAULT_BASE_POINTS, CARDS_DRAWED_AT_START_COUNT, \
    CARDS_DRAWED_AT_TURN_COUNT


class Match:
    """ store information and managing them to enable play a match and
    communicate with sockets by sending them messages with changes of
    match state, so they receive information immediately """

    def __init__(self, players: list, delete_callback: Callable):
        """ :param delete_callback: Callable - function from parent enabling
        to delete self by remove references in MatchManager
        :param players: list - users playing that match"""
        # set in database information about match, and get its id
        self.id_: int = DbInformationManager.make_match_information(
            players)

        self.channel_layer: Optional[RedisChannelLayer] = None
        self.match_name: str = "match%s" % self.id_

        self._players: list = players
        self._base_points = [DEFAULT_BASE_POINTS, DEFAULT_BASE_POINTS]

        # store index of winner globally to have access when sending initial
        # data
        self.winner_index = -1

        # lifecycle / deleting match
        self._delete_callback = delete_callback
        self._connected_consumers_count = 0

        # initializing support classes
        self._board = Board(self._send_to_sockets)
        self._turn_manager = TurnManager(
            self._send_to_sockets, self._on_turn_change)
        self._cards_manager = CardsManager(
            self._send_to_sockets, self._players)
        self._match_deleter = MatchDeleter(self._delete_self)
        self._card_player = CardPlayer(self._cards_manager, self._board)

        # draw cards at start
        self._cards_manager.draw_cards(
            count=CARDS_DRAWED_AT_START_COUNT, player_index=0)
        self._cards_manager.draw_cards(
            count=CARDS_DRAWED_AT_START_COUNT, player_index=1)

    # lifecycle / deleting self stuff

    def __del__(self):
        self.cleanup()

    def cleanup(self):
        """ make necessary operations to end properly match """
        # to set information in db that match is ended
        DbInformationManager.set_match_ended(self._winner, self.id_)
        # to definitely stop turn change thread
        self._turn_manager.stop_turn_thread()

    def _delete_self(self):
        print("\tInfo: Match: Deleting %s" % self)
        # to delete references in match_manager
        self._delete_callback(self)

        self.cleanup()

    # sockets / connection stuff

    def connect_socket(
            self, channel_layer: RedisChannelLayer, user: User) -> bool:
        """ connecting socket channel_layer to self so can send messages """
        if user not in self._players:
            return False

        self.channel_layer = channel_layer

        # when somebody connect cancel deleting self
        self._connected_consumers_count += 1
        self._match_deleter.cancel_auto_delete_timer()

        return True

    def consumer_disconnect(self):
        """ when some matchConsumer disconnect """
        self._connected_consumers_count -= 1
        # when all consumers disconnect set timer deleting self
        if self._connected_consumers_count <= 0:
            self._match_deleter.start_auto_delete_timer()

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
        for i, player in enumerate(self._players):
            if player.username == username:
                return i
        return -1

    # turns stuff

    @property
    def _player_turn(self) -> int:
        return self._turn_manager.player_turn

    def _on_turn_change(self):
        # draw card for player who start his turn now
        self._cards_manager.draw_cards(
            count=CARDS_DRAWED_AT_TURN_COUNT, player_index=self._player_turn)
        # modify players basepoints
        self._modify_base_points()
        # send info to board that turn change
        self._board.on_turn_change(self._player_turn)
        # check is someone win
        self._check_someone_win()

    # cards stuff

    @property
    def _hand_cards(self) -> list:
        return self._cards_manager.hand_cards

    @property
    def _deck_cards(self) -> list:
        return self._cards_manager.deck_cards

    # base points stuff

    def _modify_base_points(self):
        """ modify players base points depending on enemies occuping base
        count and send info when points change to sockets """
        for player_index in range(2):
            # get how much points player lost
            lost_points: int = self._board.get_player_lost_base_points(
                player_index)
            if lost_points > 0:
                self._base_points[player_index] -= lost_points
                # send info to sockets
                self._send_to_socket_base_points_changed(player_index)

    def _send_to_socket_base_points_changed(self, player_index: int):
        message = {
            'name': 'base-points-changed',
            'data': {
                'for_player_at_index': player_index,
                'new_points': self._base_points[player_index]
            }
        }
        self._send_to_sockets(message, modify=False)

    # win/lost stuff

    @property
    def _winner(self) -> Optional[User]:
        return self._players[self.winner_index] \
            if self.winner_index != -1 else None

    def _on_win(self):
        """ function made all action when somabody meet conditions to win
        match """
        self._send_to_socket_player_win()
        self._turn_manager.stop_turn_thread()
        # to set at db that match is end
        DbInformationManager.set_match_ended(self._winner, self.id_)
        # delete self after some time
        self._match_deleter.start_auto_delete_timer()

    def _check_someone_win(self):
        """ check if some player win and end game """
        self.winner_index: int = self._check_if_someone_win()
        # checking if someone win
        if self.winner_index != -1:
            self._on_win()

    def _check_if_someone_win(self) -> int:
        """ checking if one of player meet conditions to win
        :return: int - index of player who win or -1 when nobody win or -2
        when is draw """

        # check base_points

        player0_points: int = self._base_points[0]
        player1_points: int = self._base_points[1]
        if player0_points <= 0 or player1_points <= 0:
            if player0_points == player1_points:
                return -2   # when both players lost all points
            return 0 if player0_points > player1_points else 1

        # check if someone lost all units and cards (actions)

        players_actions = [0, 0]
        for player_index in range(2):
            cards_count: int = len(self._hand_cards[player_index]) + \
                len(self._deck_cards[player_index])
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
        return -1 if lost_player_index == -1 else get_opposed_index(
            lost_player_index)

    def _send_to_socket_player_win(self):
        message = {
            'name': 'player-win',
            'data': {
                'winner_index': self.winner_index,
            }
        }
        self._send_to_sockets(message, modify=False)

    # overall utils

    def _get_safe_player_data_dict(self, player_index: int) -> dict:
        enemy_index: int = get_opposed_index(player_index)

        return {
            "players_data": {
                "player": {
                    "username": self._players[player_index].username,
                    "base_points": self._base_points[player_index],
                    "deck_cards_count": len(
                        self._deck_cards[player_index]),
                    "hand_cards": self._cards_manager.get_cards_data(
                        player_index)
                },
                "enemy": {
                    "username": self._players[enemy_index].username,
                    "base_points": self._base_points[enemy_index],
                    "deck_cards_count": len(self._deck_cards[enemy_index]),
                    "hand_cards_count": len(self._hand_cards[enemy_index])
                }
            }
        }

    # Section with public methods returning data to sockets

    def give_initial_data(self, player_index: int) -> dict:
        # return data to prepare socket client
        player_data: dict = self._get_safe_player_data_dict(player_index)
        return {
            **player_data,
            "turn": self._player_turn,
            "fields": self._board.get_fields_dicts(player_index),
            "units": self._board.get_units_dicts(),
            "winner_index": self.winner_index,
            "player_index": player_index,
        }

    @run_only_when_player_has_turn
    def end_turn(self, player_index: int) -> bool:
        """ end turn for specified player by player_index """
        self._turn_manager.start_next_turn()
        return True

    @run_only_when_player_has_turn
    def play_a_card(
            self, player_index: int, card_id: int, field_id: int) -> bool:
        """ delegate playing card to proper support class
        :return: bool - whether it worked """
        return self._card_player.play_a_card(player_index, card_id, field_id)

    @run_only_when_player_has_turn
    def move_unit(
            self, player_index: int, unit_id: int, field_id: int) -> bool:
        """ delegate board to move unit
        :return: bool - if board move_unit """
        return self._board.move_unit(player_index, unit_id, field_id)

    @run_only_when_player_has_turn
    def attack_unit(
            self, player_index: int, attacker_id: int, defender_id: int
    ) -> bool:
        """ delegate board to attack unit
        :return: bool - if board attack_unit """
        return self._board.attack_unit(player_index, attacker_id, defender_id)

    def player_surrender(self, player_index: int) -> bool:
        """ handle player surrendering match
        :player_index: int - index of player which want to surrender
        :return: bool - if surrendering success """
        # check if can surrender
        if self.winner_index != -1:
            return False

        # change points
        self._base_points[player_index] = 0
        self._send_to_socket_base_points_changed(player_index)
        # check win
        self._check_someone_win()
        return True
