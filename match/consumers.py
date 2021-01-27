import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .utils.MatchManager import match_manager

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
    match_id = None
    match_name = "None"

    def connect(self):
        # get data
        user = self.scope["user"]
        print("MatchConsumer start %s" % user)

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

        self.match_name = "match%s" % self.match_id
        print("consumer connect match_name %s" % self.match_name)

        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_name,
            self.channel_name
        )

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

        if message == "get-players":
            players = list(map(lambda player: player.username, self.get_match().players))
            async_to_sync(self.channel_layer.group_send)(
                self.match_name,
                {
                    'type': 'send_to_socket',
                    'message': {
                        'name': 'players-list',
                        'players': players
                    }
                }
            )

    # Receive message from room group
    def send_to_socket(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def get_match(self):
        return match_manager.get_match_by_id(self.match_id)
