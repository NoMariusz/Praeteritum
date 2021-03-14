import time
from threading import Thread
from asgiref.sync import async_to_sync
from ..MatchManager import MatchManager


class SearcherThread(Thread):
    """ Thread specially for matching finders and creating matches for them as
    background process """

    def __init__(self, finders: list):
        """ :param finders: list - contain finders actually searching for
        match """
        super().__init__(daemon=True)
        self.finders: list = finders
        self.live = True

    def run(self):
        while(self.live):
            # wait before loops
            time.sleep(3)

            # go to next iteration when not find enough players for single
            # match
            if len(self.finders) < 2:
                continue

            # at iteration make one match
            # get finders
            finder1 = self.finders[0]
            finder2 = self.finders[1]
            # making match for players
            match_manager = MatchManager()
            match_id = async_to_sync(match_manager.make_match)(
                [finder1.player, finder2.player])
            # send info to finders that match is found
            finder1.match_id = match_id
            finder2.match_id = match_id
            # stop further findings so other can not match with that players
            finder1.cancel_finding()
            finder2.cancel_finding()
