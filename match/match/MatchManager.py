from .Match import Match
from asgiref.sync import sync_to_async


class MatchManager:
    """ Responsible for creating matches, managing them, and provide
    connection to them """

    def __init__(self):
        self.matches = []
        self.id_counter: int = 0

    async def make_match(self, for_players: list) -> int:
        """ making match for specified players, and return its id """
        match_id = self.id_counter
        match = await sync_to_async(Match)(match_id, for_players)
        self.id_counter += 1
        self.matches.append(match)
        return match.id_

    async def get_match_by_id(self, id_: int) -> Match:
        match_list = await sync_to_async(list)(
            filter(lambda match: match.id_ == id_, self.matches))
        return match_list[0] if len(match_list) > 0 else None


# some kind of singleton managing matches
match_manager = MatchManager()
