from django.test import TestCase
from asgiref.sync import async_to_sync

from ...logic.Match import Match
from ..utils import make_test_users, make_match


class MatchMoves(TestCase):
    """ check if player can make move if has turn and if cannot make move
    when has no turn """
    def setUp(self):
        # prepare match
        test_players = async_to_sync(make_test_users)()
        self.match: Match = make_match(test_players)

    def test_when_have_move(self):
        player_idx_with_turn: int = self.match._player_turn
        played = self.match.end_turn(player_index=player_idx_with_turn)
        self.assertTrue(played)

    def test_when_not_have_turn(self):
        player_idx_without_turn: int = self.match._get_opposed_index(
            self.match._player_turn)
        played_bad_move = self.match.end_turn(
            player_index=player_idx_without_turn)
        self.assertFalse(played_bad_move)
