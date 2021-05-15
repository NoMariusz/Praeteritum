import asyncio
import weakref
import time

from typing import Optional
from django.contrib.auth.models import User
from .SearcherThread import SearcherThread

from match.constants import MATCH_FINDING_TIME_LIMIT


class MatchFinder:
    """ Provide searching for match by waiting in async loop for id of match
    created by searcher_thread
    class also store self instances so searcher_thread can operate on them
    and start that thread when class is loaded
    """

    instances = []      # store all class instances
    # start thread searching for matches
    searcher_thread = SearcherThread(instances)
    searcher_thread.start()

    def __init__(self, player: User):
        self.player: User = player
        # store match id for player, can be set bo other finder
        self.match_id: Optional[int] = None
        self.search_for_match = True
        # to self.instances not contain multiple finders for that same player
        self.clear_duplicate_finders()

        # use weakref to garbage collector can delete finder if object
        # creating them stop working e.g. view which start searching is deleted
        self.instances.append(weakref.proxy(self))

    def __del__(self):
        # canceling finding when garbage collector delete object, to remove
        # self from instances list
        self.cancel_finding()

    def clear_duplicate_finders(self):
        """ stop work of finders searching for match for that same player as
        self """
        duplicate_finders = list(filter(
            lambda finder: finder.player == self.player, self.instances))
        # cancel duplicate work
        for finder in duplicate_finders:
            finder.cancel_finding()

    # finding

    async def find_match(self) -> dict:
        """ run loop trying to find other player, make match for it and return
        dict containig information about results of finding, when find match
        return in that dict match id """

        # get searching start time
        start_time: float = time.time()

        # search for match by some time, after that end searching
        while time.time() - start_time < MATCH_FINDING_TIME_LIMIT:
            # wait some time before next check
            await asyncio.sleep(3)

            # if finder have set match return it
            if self.match_id is not None:
                return {
                    "status_code": 1,
                    "status_message": "Found match",
                    "match_id": self.match_id,
                }

            # when instance stop searching, return proper result
            if not self.search_for_match:
                return {
                    "status_code": 4,
                    "status_message": "Cancel finding",
                    "match_id": None,
                }

        # default return information that searching ended
        return {
            "status_code": 5,
            "status_message": "Searching time end",
            "match_id": None,
        }

    # canceling finding

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

    # checking if finding match

    @classmethod
    def isFinding(cls, for_player: User) -> bool:
        """ :param for_player: User -  user for which check if actually
        finding match
        :return: bool - if MatchFinder actually find for match"""
        return any(
            inst.player == for_player and inst.match_id is None
            for inst in cls.instances)
