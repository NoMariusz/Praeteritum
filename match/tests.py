import asyncio
from django.test import TestCase
from asgiref.sync import async_to_sync

from authentication.utils import create_user
from .logic.Match import Match
from .logic.MatchFinder import MatchFinder
from .logic.MatchManager import match_manager
from cards.models import CardModel
from .constatnts import TURN_TIME, BOARD_ROWS, BOARD_COLUMNS


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
        first_field_id_for_0: int = fields_for_0[0]["id_"]
        first_field_id_for_1: int = fields_for_1[0]["id_"]
        # check fields ids_ are proper for players, that id 0 is first for
        # player 0
        id_for_0_ok = first_field_id_for_0 == 0
        id_for_1_ok = first_field_id_for_1 == BOARD_COLUMNS * BOARD_ROWS - 1

        self.assertTrue(id_for_0_ok and id_for_1_ok)


# utils for tests

async def make_test_users():
    """ Make two test players in base and return list of them """
    user1 = await create_user(
        username='test1', password='test1', email='test1@tt.com')
    user2 = await create_user(
        username='test2', password='test2', email='test2@tt.com')
    return [user1, user2]
