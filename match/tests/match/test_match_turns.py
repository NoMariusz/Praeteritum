import asyncio
import pytest

from unittest.mock import patch
from channels.db import database_sync_to_async

from ...logic.MatchManager import MatchManager
from ...logic.Match import Match
from ..utils import make_test_users


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
# patch refreshing and changing turn time for TurnManager to speed up test
@patch("match.logic.match_modules.TurnManager.TURN_TIME", 1)
@patch(
    "match.logic.match_modules.TurnManager.TURN_STATUS_REFRESH_TIME", 0.1)
async def test_match_turn_changing():
    """check if match turn changed in time correctly"""
    # make match
    test_players: list = await database_sync_to_async(make_test_users)()
    match_manager = MatchManager()
    match_id: int = await database_sync_to_async(match_manager.make_match)(
        test_players)
    match: Match = await match_manager.get_match_by_id(match_id)

    # get start turn, wait to change it, and assert if turn change
    start_turn = match._player_turn
    # wait a little bit longer to turn have time to change
    await asyncio.sleep(1.1)
    next_turn = match._player_turn
    assert start_turn != next_turn
