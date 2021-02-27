import asyncio
import random
from typing import Optional
from django.test import TestCase
from asgiref.sync import async_to_sync

from authentication.utils import create_user
from .logic.Match import Match
from .logic.match_modules.Unit import Unit
from .logic.match_modules.Field import Field
from .logic.MatchFinder import MatchFinder
from .logic.MatchManager import match_manager
from cards.models import CardModel
from .constatnts import TURN_TIME, BOARD_ROWS, BOARD_COLUMNS, \
    DEFAULT_ATTACK_POINTS


class FindMatch(TestCase):
    async def test_can_find_match(self):
        """check if can find match, get proper ids"""

        finder_coros = []
        match_ids = []

        async def wait_to_get_match_id(coroutine):
            match_ids.append(await coroutine)

        # make users
        # start finding match to users
        test_players = await make_test_users()
        for user in test_players:
            finder = MatchFinder(user)
            finder_coros.append(finder.find_match())
        # wait to all users recieve match id
        await asyncio.gather(
            wait_to_get_match_id(finder_coros[0]),
            wait_to_get_match_id(finder_coros[1])
        )
        self.assertEqual(match_ids[0], match_ids[1])


class MatchWork(TestCase):
    async def test_match_not_forgot(self):
        """check if match remember his properties so overall work properly"""
        test_players = await make_test_users()
        match_id = await match_manager.make_match(test_players)

        # get match, set him property, get again and check if property match
        match = await match_manager.get_match_by_id(match_id)
        match.match_name = 'test_match_name'
        match2 = await match_manager.get_match_by_id(match_id)
        self.assertEqual(match2.match_name, 'test_match_name')

    async def test_match_turn_changing(self):
        """check if match turn changed in time correctly"""
        # make match
        test_players = await make_test_users()
        match_id = await match_manager.make_match(test_players)
        match: Match = await match_manager.get_match_by_id(match_id)

        # get start turn, wait to change it, and assert if turn change
        start_turn = match.player_turn
        print("get start turn", start_turn)
        # wait a little bit longer to turn have time to change
        await asyncio.sleep(TURN_TIME*1.1)
        next_turn = match.player_turn
        print("get next_turn", next_turn)
        self.assertNotEqual(start_turn, next_turn)

    def test_match_good_format_cards(self):
        """ check if function formatting data in cards model, good return data
        """
        test_card_name = "test_card_123#@!"
        # made match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made card
        card = CardModel(
            name=test_card_name, category=CardModel.CardTypes.CAVALRYMAN,
            rarity=CardModel.CardRarities.COMMON, attack=20, hp=60)
        card.save()
        # made it data
        data = match._made_card_data_by_id(card.id)
        self.assertEqual(test_card_name, data["name"])

    def test_fields_are_put_in_order_for_player(self):
        """ check if board returning fields in proper order for players"""
        # made match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # get fields
        fields_for_0: list = match._board.get_fields_dicts(0)
        fields_for_1: list = match._board.get_fields_dicts(1)
        # get fields ids for specified players
        first_field_id_for_0: int = fields_for_0[0]["id"]
        first_field_id_for_1: int = fields_for_1[0]["id"]
        # check fields ids_ are proper for players, that id 0 is first for
        # player 0
        id_for_0_ok = first_field_id_for_0 == 0
        id_for_1_ok = first_field_id_for_1 == BOARD_COLUMNS * BOARD_ROWS - 1

        self.assertTrue(id_for_0_ok and id_for_1_ok)

    def test_if_players_moves_are_restricted(self):
        """ check if player can make move if has turn and if cannot make move
        when has no turn """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # make move with turn
        player_idx_with_turn: int = match.player_turn
        played = match.end_turn(player_index=player_idx_with_turn)
        # make move without turn
        player_idx_without_turn: int = match._get_opposed_index(
            match.player_turn)
        played_bard_move = match.end_turn(player_index=player_idx_without_turn)
        # check if can move and cannot move
        self.assertTrue(played and not played_bard_move)

    def test_are_units_made_proper(self):
        """ check if board made proper units by given card data """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made card
        card = make_test_card()
        # made unit by card
        card_data: dict = match._made_card_data_by_id(card.id)
        unit = match._board._create_new_unit(card_data, 1, -1)

        self.assertTrue(unit.name == card.name and unit.image == card.image)

    def test_units_move(self):
        """ check if units in board can be moved, and if moves are proper
        restricted """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made card for unit
        card = make_test_card()
        # prepare player indexes
        p1_index = 0
        p2_index = 1
        # made unit by card and add to board
        card_data: dict = match._made_card_data_by_id(card.id)
        unit1_id = match._board.add_unit_by_card_data(card_data, p1_index, 0)
        unit2_id = match._board.add_unit_by_card_data(card_data, p2_index, 1)

        # make good move
        move_1_succes = match._board.move_unit(p1_index, unit1_id, 2)

        # make bad move because in field 2 is other unit
        move_2_succes = match._board.move_unit(p1_index, unit1_id, 1)

        # make bad move because player1 can not move player2 unit
        move_3_succes = match._board.move_unit(p1_index, unit2_id, 3)

        # make bad move because field is too far
        match._board.move_unit(p1_index, unit1_id, 0)
        move_4_succes = match._board.move_unit(
            p1_index, unit1_id, BOARD_COLUMNS-1)

        self.assertTrue(move_1_succes)
        self.assertFalse(move_2_succes)
        self.assertFalse(move_3_succes)
        self.assertFalse(move_4_succes)

    def test_units_attack(self):
        """ check if units in board can attack each other and if his attacks
        are proper restricted"""
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made card for unit
        card = make_test_card()
        # prepare player indexes
        p1_index = 0
        p2_index = 1
        # made unit by card and add to board
        card_data: dict = match._made_card_data_by_id(card.id)
        unit1_id = match._board.add_unit_by_card_data(card_data, p1_index, 0)
        unit2_id = match._board.add_unit_by_card_data(card_data, p2_index, 1)

        # make good attack
        action_1_succes = match._board.attack_unit(
            p1_index, unit1_id, unit2_id)

        # make bad attack because unit1 has not attack points
        for i in range(DEFAULT_ATTACK_POINTS - 1):   # to drain attack points
            match._board.attack_unit(p1_index, unit1_id, unit2_id)
        action_2_succes = match._board.attack_unit(
            p1_index, unit1_id, unit2_id)
        match._board.on_turn_change()   # to restore attack points

        # make bad attack because player1 can not attack by player2 unit
        action_3_succes = match._board.attack_unit(
            p1_index, unit2_id, unit1_id)

        # make bad attack because unit is too far
        unit2 = match._board._get_unit_by_id(unit2_id)   # get unit2
        unit2.move_points += 999    # modify move_points to move them far
        # move unit2 far from unit1
        match._board.move_unit(p2_index, unit2_id, BOARD_COLUMNS-1)
        action_4_succes = match._board.attack_unit(
            p1_index, unit1_id, unit2_id)

        # make bad attack because can not attack himself
        action_5_succes = match._board.attack_unit(
            p1_index, unit1_id, unit1_id)

        self.assertTrue(action_1_succes)
        self.assertFalse(action_2_succes)
        self.assertFalse(action_3_succes)
        self.assertFalse(action_4_succes)
        self.assertFalse(action_5_succes)

    def test_missleman_not_attack_as_defender(self):
        """ check if units of type MISSLEMAN only deal damage when they attack
        """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made cards for unit
        card = make_test_card()
        card2 = make_test_card(CardModel.CardTypes.MISSLEMAN)
        # prepare player indexes
        p1_index = 0
        p2_index = 1
        # made units by card and add to board
        card_data: dict = match._made_card_data_by_id(card.id)
        card_data2: dict = match._made_card_data_by_id(card2.id)
        unit1_id = match._board.add_unit_by_card_data(card_data, p1_index, 0)
        unit2_id = match._board.add_unit_by_card_data(card_data2, p2_index, 1)
        # get start hp of normal INFANTRYMAN Unit
        unit1: Unit = match._board._get_unit_by_id(unit1_id)
        start_hp: int = unit1.hp
        # attack as INFANTRYMAN MISSLEMAN Unit
        match._board.attack_unit(p1_index, unit1_id, unit2_id)
        # get hp of INFANTRYMAN Unit after attack
        end_hp: int = unit1.hp

        # check if hp not changed
        self.assertEqual(start_hp, end_hp)

    def test_base_points_changing(self):
        """ check if base_points change when enemy unit is occupying your
        base """
        # prepare match
        test_players = async_to_sync(make_test_users)()
        match: Match = Match(1, players=test_players)
        # made card for unit
        card = make_test_card()
        # prepare player indexes
        p1_index = 0
        p2_index = 1
        # made unit by card and add to board
        card_data: dict = match._made_card_data_by_id(card.id)
        unit1_id = match._board.add_unit_by_card_data(card_data, p1_index, 0)
        # find player 2 base field
        player2_field: Optional[Field] = None
        for field in match._board._fields:
            if field.is_base and field.player_half == p2_index:
                player2_field = field
                break
        if player2_field is None:
            raise(ValueError(
                "Can not find any base field for player at index %s"
                % p2_index))
        # make move to player2 base field
        unit1: Unit = match._board._get_unit_by_id(unit1_id)   # get unit1
        unit1.move_points += 999    # modify move_points to move them far
        match._board.move_unit(p1_index, unit1_id, player2_field.id_)
        # get start base points of player2
        start_points: int = match._players_data[p2_index]["base_points"]
        # modify base points
        match._modify_base_points()
        # get points after check
        end_points: int = match._players_data[p2_index]["base_points"]

        self.assertNotEqual(start_points, end_points)


class MatchWinDetection(TestCase):
    """ check if Match proper check if some player win """
    def setUp(self):
        # make card to players have card at start
        make_test_card(default_in_deck=True)
        # prepare match
        test_players = async_to_sync(make_test_users)()
        self.match: Match = Match(1, players=test_players)

        # prepare player indexes
        self.p1_index = 0
        self.p2_index = 1

    def test_base_points(self):
        """ test if match check win at base points changes """
        # default check
        check0_result: int = self.match._check_if_someone_win()
        # default player have points and cards so should return -1, nobody win
        self.assertEqual(-1, check0_result)

        # check by base points
        self.match._players_data[self.p1_index]["base_points"] = -4
        check1_result: int = self.match._check_if_someone_win()
        # if player1 lost all point then wind player2
        self.assertEqual(self.p2_index, check1_result)

        # check draw base points
        self.match._players_data[self.p2_index]["base_points"] = -4
        check2_result: int = self.match._check_if_someone_win()
        # if both players lost points with the same count should be -2, draw
        self.assertEqual(-2, check2_result)

    def test_cards(self):
        """ test if match check win at cards count changes """
        # when player lost all cards
        self.match._players_data[self.p1_index]["hand_cards_ids"] = []
        self.match._players_data[self.p1_index]["deck_cards_ids"] = []
        check_result: int = self.match._check_if_someone_win()
        # when player1 have not any card, player2 win
        self.assertEqual(self.p2_index, check_result)

        # when both player lost all cards
        self.match._players_data[self.p2_index]["hand_cards_ids"] = []
        self.match._players_data[self.p2_index]["deck_cards_ids"] = []
        check2_result: int = self.match._check_if_someone_win()
        # when player1 and player2 have not any card should be -2, draw
        self.assertEqual(-2, check2_result)


# utils for tests

async def make_test_users() -> list:
    """ Make two test players in base and return list of them """
    user1 = await create_user(
        username='test1', password='test1', email='test1@tt.com')
    user2 = await create_user(
        username='test2', password='test2', email='test2@tt.com')
    return [user1, user2]


def make_test_card(
        card_type=CardModel.CardTypes.INFANTRYMAN, default_in_deck=False
        ) -> CardModel:
    """ make card, save it and return it"""
    card = CardModel(
        name="testCard%s" % random.random(), category=card_type,
        rarity=CardModel.CardRarities.COMMON, attack=1, hp=99,
        defaultInDeck=default_in_deck)
    card.save()
    return card
