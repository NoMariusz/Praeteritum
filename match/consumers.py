import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

''' place to put WebsocketConsumers code '''


class MatchConsumer(WebsocketConsumer):
    '''
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
    '''
    users_list = []

    def connect(self):
        # get data
        print("MatchConsumer start %s" % self.scope["user"])
        self.users_list.append(self.scope["user"])
        self.match_name = \
            "match%s" % self.scope['url_route']['kwargs']['match_id']
        print("consumer connect match_name%s" % self.match_name)

        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        print('MatchConsumer disconnect')
        # Leave match group
        async_to_sync(self.channel_layer.group_discard)(
            self.match_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('MatchConsumer recieve get data %s' % text_data_json)
        message = text_data_json['message']
        print('MatchConsumer recieve message %s' % message)

        if message == "show":
            async_to_sync(self.channel_layer.group_send)(
                self.match_name,
                {
                    'type': 'user_list',
                    'message': 'users %s' % self.users_list
                }
            )
        # self.send(text_data=json.dumps({
        #     'message': 'users %s' % self.users_list
        # }))

    # Receive message from room group
    def user_list(self, event):
        message = event['message']
        print("MatchConsumer user_list")

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
