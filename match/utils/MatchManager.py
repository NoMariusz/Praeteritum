from .Match import Match


class MatchManager:
    ''' Responsible for creating matches, managing them, and provide
    connection to them'''
    def __init__(self):
        self.matches = []
        self.id_counter = 0

    def make_match(self, for_players):
        print('making match for players %s' % for_players)
        match_id = self.id_counter
        match = Match(match_id, for_players)
        self.id_counter += 1
        self.matches.append(match)
        return match_id

    def get_match_by_id(self, _id):
        return list(
            filter(lambda match: match.match_id == _id, self.matches))[0]


# some kind of singleton managing matches
match_manager = MatchManager()
