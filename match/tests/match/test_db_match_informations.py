from django.test import TestCase

from ...logic.Match import Match
from ..utils import make_test_users
from ...models import MatchInformation


class MatchDbInformation(TestCase):
    """ check if Match correctly work with MatchInformation """

    def setUp(self):
        # prepare players
        self.test_players = make_test_users()

    def test_if_making(self):
        # check if at start is 0 MatchInformation
        match_info_count = MatchInformation.objects.count()
        self.assertEqual(match_info_count, 0)

        # make Match so MatchInformation should be made
        Match(self.test_players, lambda _: None)

        # check if new MatchInformation was make
        match_info_count = MatchInformation.objects.count()
        self.assertEqual(match_info_count, 1)

    def test_start_status(self):
        # make match
        match = Match(self.test_players, lambda _: None)

        # check if new created MatchInformation have status running
        match_info = MatchInformation.objects.get(id=match.id_)
        self.assertEqual(match_info.status, MatchInformation.Statuses.RUNNING)

    def test_after_end_status(self):
        # make match
        match = Match(self.test_players, lambda _: None)
        # end match
        match._on_win()

        # check if new created MatchInformation have status running
        match_info = MatchInformation.objects.get(id=match.id_)
        self.assertEqual(match_info.status, MatchInformation.Statuses.ENDED)
