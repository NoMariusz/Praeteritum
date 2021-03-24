from typing import Optional
from asgiref.sync import sync_to_async
from .Match import Match
from .DbInformationManager import DbInformationManager


class MatchManager:
    """ class responsible for:
    - creating matches for given players
    - storing references to them, so garbage collector can not delete them
    - returning matches by giving match id
    - allowing to delete matches by removing reference to them from matches
    list """

    # list storing reference to all matches
    matches = []

    def make_match(self, for_players: list) -> int:
        """ making match for specified players, and return its id """
        # set in database information about match, and get its id
        match_id = DbInformationManager.make_match_information(for_players)
        # make match in memory
        match: Match = Match(
            match_id, for_players, delete_callback=self._end_match
        )
        self.matches.append(match)
        return match.id_

    async def get_match_by_id(self, id_: int) -> Optional[Match]:
        """ :return: Match - match object in self.matches with given id """
        match_list = await sync_to_async(list)(
            filter(lambda match: match.id_ == id_, self.matches))
        return match_list[0] if len(match_list) > 0 else None

    def _end_match(self, match: Match):
        """ end match by delete him from memory """
        # delete reference to Match so garbage collector can delete him
        if match in self.matches:
            self.matches.remove(match)
