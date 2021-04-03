import asyncio
import pytest
from channels.db import database_sync_to_async
from unittest.mock import patch

from match.logic.Match import Match
from match.logic.MatchManager import MatchManager
from ..utils import make_test_users


#  fixtures

@pytest.fixture
def match_manager() -> MatchManager:
    return MatchManager()


@pytest.fixture
def clear_match_manager_matches(match_manager) -> list:
    """ clear all matches in match_manager """
    match_manager.matches = []
    return match_manager.matches


@pytest.fixture
@patch("match.logic.match_modules.MatchDeleter.MATCH_DELETE_TIMEOUT", 0.1)
def match_id(
        transactional_db, clear_match_manager_matches, match_manager) -> int:
    """ make match by matchmanager """
    test_players = make_test_users()
    match_id: int = match_manager.make_match(test_players)
    return match_id


# tests

def test_if_default_exists(match_manager, match_id):
    """ check if after making Match match_manager add it to list """
    matches_len = len(match_manager.matches)
    assert matches_len == 1


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_when_nobody_connect(match_manager, match_id):
    """ test if deleting when nobody is in Match """
    # wait to match should delete self
    await asyncio.sleep(0.2)
    # check if match is deleted from match_manager list
    matches_len = len(match_manager.matches)
    assert matches_len == 0


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_when_match_end(match_manager, match_id):
    """ test if deleting Match after game end """
    # get match by match_manager
    match: Match = await match_manager.get_match_by_id(match_id)
    # change base points to somebody lose
    match._base_points[0] = -4
    await database_sync_to_async(match._check_someone_win)()
    # wait to match should delete self
    await asyncio.sleep(0.2)
    # check if match is deleted from match_manager list
    matches_len = len(match_manager.matches)
    assert matches_len == 0
