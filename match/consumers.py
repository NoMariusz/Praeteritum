import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .match.MatchManager import match_manager

''' place to put WebsocketConsumers code '''


class MatchConsumer(WebsocketConsumer):
    """
    Connection system for this consumer:
    - client start connection, connect fun handle authorization, join match
     group
    - at disconnect, leave match group, when all users disconnect get info to
     match about it
    - after connect, client can send messages, receive function handle it ask
     match for data, and send back to client
    - when some event occur on match, then match send message to his
     channelGroup, that message should be handled by custom functions in
     Consumer, and then data should be send to clients
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.recieve_commands = {
            "get-initial-data": self.get_initial_match_data,
            "client-connect": self.on_client_connect
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
        match = self.get_match()
        if match is None:
            self.close()
            return False
        can_connect_to_match = match.connect_socket(self.channel_layer, user)
        if not can_connect_to_match:
            self.close()
            return False

        # Join match group
        self.match_name = "match%s" % self.match_id
        print("consumer connect to match_name: %s" % self.match_name)

        async_to_sync(self.channel_layer.group_add)(
            self.match_name,
            self.channel_name
        )

        # prepare consumer to futher work
        self.load_player_index()

        self.accept()

    def disconnect(self, close_code):
        # Leave match group
        async_to_sync(self.channel_layer.group_discard)(
            self.match_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if message in self.recieve_commands.keys():
            self.recieve_commands[message]()

    # Receive message from room group
    def send_to_socket(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def load_player_index(self):
        username = self.scope["user"].username
        match = self.get_match()
        self.player_index = match.get_player_index_by_name(username)
        if self.player_index == -1:
            raise Exception("Socket can not find his player_index")

    def get_match(self):
        return async_to_sync(
            lambda: match_manager.get_match_by_id(self.match_id)
        )()

    # utils related to recieve/send
    def get_initial_match_data(self):
        match = self.get_match()
        data = match.give_initial_data(self.player_index)
        self.send(text_data=json.dumps({
            'message': {
                'name': 'get-initial-data',
                'data': data
            }
        }))

    def on_client_connect(self):
        async_to_sync(self.channel_layer.group_send)(
            self.match_name,
            {
                'type': 'send_to_socket',
                'message': {
                    'name': 'client-connect',
                    'player': self.scope["user"].username
                }
            }
        )
