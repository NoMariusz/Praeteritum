import asyncio
import weakref
from typing import Optional
from django.contrib.auth.models import User
from .MatchManager import MatchManager


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

    def __init__(self, player: User):
        # use weakref to garbage collector can delete finder if object
        # creating them stop working e.g. view which start searching is deleted
        self.instances.append(weakref.proxy(self))

        self.player: User = player
        # store match id for player, can be set bo other finder
        self.match_id: Optional[str] = None
        self.search_for_match = True

    def __del__(self):
        # canceling finding when garbage collector delete object, to remove
        # self from instances list
        self.cancel(self.player)

    async def find_match(self) -> int:
        """ run loop trying to find other player, make match for it and return
        new match id, in special case return id when other instance give her
        id directly to self.match_id """
        while self.search_for_match:
            # wait some time before next check
            await asyncio.sleep(3)

            # if finder have set match return it
            if self.match_id is not None:
                return self.match_id

            # get list with finders for other players
            filered_list = list(
                filter(
                    lambda inst: inst.player != self.player,
                    self.instances
                )
            )
            # go to next iteration when not find other players finders
            if len(filered_list) <= 0:
                continue

            # when found other player finder
            second_finder = filered_list[0]
            # making match for players
            match_manager = MatchManager()
            match_id = await match_manager.make_match(
                [self.player, second_finder.player])
            # send info to other finder that match is found
            second_finder.match_id = match_id
            # stop further findings so other can not match with that players
            self.cancel_finding()
            second_finder.cancel_finding()

            return match_id

    @classmethod
    def cancel(cls, for_player: User):
        """ cancel all finders work for specified player """
        # get all instances finding match for player
        finders_for_player = list(filter(
            lambda inst: inst.player == for_player, cls.instances
        ))

        # if found some finder instances, cancel their finding
        for finder in finders_for_player:
            finder.cancel_finding()

    def cancel_finding(self):
        """ cancelling finding for that finder instance """
        # to cancel finder work only once
        if self.search_for_match:
            self.search_for_match = False
            self.instances.remove(self)
