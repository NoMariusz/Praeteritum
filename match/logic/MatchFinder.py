import asyncio
import weakref
from typing import Optional
from django.contrib.auth.models import User
from .MatchManager import match_manager


class MatchFinder:
    """ class searching match for players, work:
    - adding player to waiting_players_list
    - checking in interval if there is oponent for player
    - if found oponent, then delegate MatchManager to create match for players
    and return its id
    - if other finder instance create match, then simply returning id
    - if it is needed to cancel finding, you can use class Method that find
    finder for player and cancel its work """

    instances = []      # store all class instances
    waiting_players_list = []       # store all waiting for match players

    def __init__(self, player: User):
        # use weakref to garbage collector can delete finder if object
        # creating them stop working e.g. view which start searching is deleted
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
            # wait some time before next check
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
            # go to next iteration when nobody found
            if len(filered_list) <= 0:
                continue

            # when found other player
            second_player = filered_list[0]
            # making match for players
            match_id = await match_manager.make_match(
                [self.player, second_player])
            # send info to other finders that match is found
            self._set_found(for_player=second_player, match_id=match_id)
            # stop findings for players
            self.cancel(for_player=self.player)
            self.cancel(for_player=second_player)

            return match_id

    @classmethod
    def cancel(cls, for_player: User):
        """ cancel finders work for specified player """
        # get all instances finding match for player
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))

        # if found some finder instance, cancel its finding
        if len(finders_for_player) > 0:
            finder: MatchFinder = finders_for_player[0]
            finder.cancel_finding()

    @classmethod
    def _set_found(cls, for_player: User, match_id: int):
        """ :param: for_player: User - player for which set directly match_id
        set match_id in other player's finder to enable them find that same
        match """
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))
        for finder in finders_for_player:
            finder.match_id = match_id

    def cancel_finding(self):
        """ cancelling finding in that finder instance """
        self.waiting_players_list.remove(self.player)
        self.search_for_match = False
        self.instances.remove(self)
