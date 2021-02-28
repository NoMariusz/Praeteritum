import asyncio
import weakref
from typing import Optional
from django.contrib.auth.models import User
from .MatchManager import match_manager


class MatchFinder:
    instances = []      # store all class instances
    waiting_players_list = []       # store all waiting for match players

    def __init__(self, player: User):
        self.instances.append(weakref.proxy(self))

        self.player: User = player
        self.waiting_players_list.append(self.player)
        # store match id for player, can be set bo other finder
        self.match_id: Optional[str] = None
        self.search_for_match = True

    def __del__(self):
        # canceling finding when garbage collector delete object, to remove
        # data of self from class lists
        self.cancel(self.player)

    async def find_match(self) -> int:
        """ run loop trying to find other player, make match for it and return
        new match id, in special case return id when other instance give her
        id directly to self.match_id """
        while self.search_for_match:
            await asyncio.sleep(3)
            # if finder have found match return it
            if self.match_id is not None:
                return self.match_id
            # get list with other players
            filered_list = list(
                filter(
                    lambda player: player != self.player,
                    self.waiting_players_list
                )
            )
            # go to next while iteration when nobody found
            if len(filered_list) <= 0:
                continue

            # when found other player
            second_player = filered_list[0]
            # making match for players
            match_id = await match_manager.make_match(
                [self.player, second_player])
            # send info to other player's finder that match is found
            self._set_found(for_player=second_player, match_id=match_id)
            # stop findings for players
            self.cancel(for_player=self.player)
            self.cancel(for_player=second_player)

            return match_id

    @classmethod
    def cancel(cls, for_player: User):
        """ cancel finder work for specified player """
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))

        if len(finders_for_player) > 0:
            finder = finders_for_player[0]
            finder.cancel_finding()
            cls.instances.remove(finder)

    @classmethod
    def _set_found(cls, for_player: User, match_id: int):
        """ :param: for_player: User - player for which set directly match_id
        send info to other player's finder with match id to
        enable them find that same match """
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))
        for finder in finders_for_player:
            finder.match_id = match_id

    def cancel_finding(self):
        self.waiting_players_list.remove(self.player)
        self.search_for_match = False
