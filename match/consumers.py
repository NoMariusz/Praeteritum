import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .logic.MatchManager import match_manager
from .logic.Match import Match


class MatchConsumer(WebsocketConsumer):
    """
    Connection system for this consumer:
    - client start connection, connect fun handle authorization, join match
     group
    - at disconnect, leave match group, when all users disconnect should send
     info to match about it
    - after connect, client can send messages, receive function handle it ask
     match for data, and send back to client
    - when some event occur on match, then match send message to his
     channelGroup, that message should be handled by Consumer, and then data
     should be send to clients
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.recieve_commands = {
            "get-initial-data": self.get_initial_match_data,
            "get-player-index": self.get_player_index,
            "end-turn": self.end_turn,
            "play-a-card": self.play_a_card,
            "move-unit": self.move_unit,
            "attack-unit": self.attack_unit,
        }

        self.match_id = None
        self.match_name = "None"
        self.player_index = None

    def connect(self):
        # get data
        user = self.scope["user"]
        print("MatchConsumer start for %s" % user)

        # check if match exists
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        match = self._get_match()
        if match is None:
            self.close()
            return False
        can_connect_to_match = match.connect_socket(self.channel_layer, user)
        if not can_connect_to_match:
            self.close()
            return False

        # Join match group
        self.match_name = match.match_name
        print("consumer connect to match_name: %s" % self.match_name)

        async_to_sync(self.channel_layer.group_add)(
            self.match_name,
            self.channel_name
        )

        # prepare consumer to further work
        self._load_player_index()

        self.accept()

    def disconnect(self, close_code):
        # send information to match that consumer disconnect
        match = self._get_match()
        if match is not None:
            match.consumer_disconnect()
        # Leave match group
        async_to_sync(self.channel_layer.group_discard)(
            self.match_name,
            self.channel_name
        )

    def receive(self, text_data):
        """ recieve message from client WebSocket """
        # get data from text_data
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        data = text_data_json['data'] \
            if 'data' in text_data_json.keys() else None
        # delegate work to proper function specified in self.recieve_commands
        if message in self.recieve_commands.keys():
            self.recieve_commands[message](data, message)

    def send_to_socket(self, event):
        """ receive message from room group and send to client """
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def send_to_socket_and_modify_message(self, event):
        """ receive message from group, modify message to be more customized
        for this socket client and then send """
        # copy message and message['data'] dict to not affect in event dict to
        # other sockets
        message: dict = event['message'].copy()
        message_data: dict = message["data"].copy()

        # secure to not send info about enemy cards
        if "new_cards" in message_data.keys():
            # if that information isn't about player cards, but enemy cards
            if not message_data["for_player_at_index"] == self.player_index:
                cards: list = message_data.pop("new_cards",  [])
                message_data["new_count"] = len(cards)

        # set copied message_data dict to message dict
        message["data"] = message_data

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def _load_player_index(self):
        username = self.scope["user"].username
        match = self._get_match()
        self.player_index = match.get_player_index_by_name(username)
        if self.player_index == -1:
            raise Exception("Socket can not find his player_index")

    def _get_match(self) -> Match:
        return async_to_sync(match_manager.get_match_by_id)(self.match_id)

    # utils related to recieve/send

    def get_initial_match_data(self, data, message, *args, **kwargs):
        match = self._get_match()
        data = match.give_initial_data(self.player_index)
        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': data
            }
        }))

    def get_player_index(self, data, message, *args, **kwargs):
        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': {
                    'player_index': self.player_index
                }
            }
        }))

    def end_turn(self, data, message, *args, **kwargs):
        match = self._get_match()
        if_ended_turn = match.end_turn(player_index=self.player_index)
        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': {
                    'result': if_ended_turn
                }
            }
        }))

    def play_a_card(self, data, message, *args, **kwargs):
        # validate socket message data
        if "card_id" not in data.keys() or "field_id" not in data.keys():
            self.send(text_data=json.dumps({
                'message': {
                    'name': message,
                    'data': {
                        'result': False
                    }
                }
            }))
            return False

        match: Match = self._get_match()
        card_id: int = data["card_id"]
        field_id: int = data["field_id"]

        result: bool = match.play_a_card(
            player_index=self.player_index, card_id=card_id,
            field_id=field_id)

        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': {
                    'result': result
                }
            }
        }))

    def move_unit(self, data, message, *args, **kwargs):
        # validate socket message data
        if "unit_id" not in data.keys() or "field_id" not in data.keys():
            self.send(text_data=json.dumps({
                'message': {
                    'name': message,
                    'data': {
                        'result': False
                    }
                }
            }))
            return False

        match: Match = self._get_match()
        unit_id: int = data["unit_id"]
        field_id: int = data["field_id"]

        result: bool = match.move_unit(
            player_index=self.player_index, unit_id=unit_id,
            field_id=field_id)

        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': {
                    'result': result
                }
            }
        }))

    def attack_unit(self, data, message, *args, **kwargs):
        # validate socket message data
        if "attacker_id" not in data.keys() \
                or "defender_id" not in data.keys():
            self.send(text_data=json.dumps({
                'message': {
                    'name': message,
                    'data': {
                        'result': False
                    }
                }
            }))
            return False

        match: Match = self._get_match()
        attacker_id: int = data["attacker_id"]
        defender_id: int = data["defender_id"]

        result: bool = match.attack_unit(
            player_index=self.player_index, attacker_id=attacker_id,
            defender_id=defender_id)

        self.send(text_data=json.dumps({
            'message': {
                'name': message,
                'data': {
                    'result': result
                }
            }
        }))
