from functools import wraps
from typing import Callable


# utils for Match


def run_only_when_player_has_turn(func) -> Callable:
    """ decorator allowing run only when player has turn,
    function decorates should have 'player_index' arg """
    @wraps(func)
    def wrapper(self, player_index: int, *args, **kwargs):
        """ :param self: - instance of Match which func is decorated
        :param player_index: - index of player requesting for action """
        # if is not the player turn he can not run func
        if self._player_turn != player_index:
            return False

        return func(self, player_index, *args, **kwargs)
    return wrapper


def get_opposed_index(player_index: int) -> int:
    return (player_index + 1) % 2
