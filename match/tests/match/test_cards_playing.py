from django.test import TestCase

from match.logic.Match import Match
from ..utils import make_test_users, make_test_card, make_match


class MatchCardsPlaying(TestCase):
    def setUp(self) -> None:
        # prepare card
        self.card_match_obj = make_test_card(default_in_deck=True)
        # users should have in db default card made line above
        test_players = make_test_users()
        # prepare match
        self.match: Match = make_match(test_players)

    def test_cards_playing(self):
        """ check if Match correctly play cards """
        player_with_turn = self.match._player_turn

        # prepare card to play
        self.match._cards_manager.draw_cards(1, player_with_turn)
        card = self.match._cards_manager.hand_cards[player_with_turn][0]

        # get field where can play a card
        field = [f for f in self.match._board._fields if
                 f.player_half == player_with_turn and f.is_base][0]

        # save info from before play a card
        hand_length = len(self.match._cards_manager.hand_cards)
        field_unit_before_play = field.unit

        self.match.play_a_card(player_with_turn, card.id, field.id_)

        # check if playing a card success
        self.assertEqual(
            len(self.match._cards_manager.hand_cards), hand_length)
        self.assertNotEqual(field_unit_before_play, field.unit)
