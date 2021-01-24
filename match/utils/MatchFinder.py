import asyncio
import weakref
from django.contrib.auth.models import User
from .MatchManager import match_manager


class MatchFinder:
    instances = []      # store all class instances
    waiting_players_list = []       # store all waiting for match players

    def __init__(self, player: User):
        self.instances.append(weakref.proxy(self))

        self.player = player
        self.search_for_match = True
        # store match id for playere when is found by other finder
        self.match_id = None
        self.waiting_players_list.append(self.player)

    async def find_match(self):
        while self.search_for_match:
            print(self.waiting_players_list)
            await asyncio.sleep(5)
            if (self.match_id is not None):
                return self.match_id
            # make in future finding more fitted enemy to player
            filered_list = list(
                filter(
                    lambda player: player != self.player,
                    self.waiting_players_list
                )
            )
            if len(filered_list) > 0:
                second_player = filered_list[0]

                match_id = match_manager.make_match(
                    [self.player, second_player])
                self.set_found(for_player=second_player, match_id=match_id)

                self.cancel(for_player=self.player)
                self.cancel(for_player=second_player)

                return match_id

    @classmethod
    def cancel(cls, for_player):
        ''' cancel all finders work for player '''
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))
        for finder in finders_for_player:
            finder.cancel_finding()
            cls.instances.remove(finder)

    @classmethod
    def set_found(cls, for_player, match_id):
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))
        for finder in finders_for_player:
            finder.match_id = match_id

    def cancel_finding(self):
        self.waiting_players_list.remove(self.player)
        self.search_for_match = False
