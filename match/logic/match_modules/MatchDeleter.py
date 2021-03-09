from threading import Timer
from typing import Callable, Optional
from ...constants import MATCH_DELETE_TIMEOUT


class MatchDeleter:
    """ module for Match managing timer deleting Match """

    def __init__(self, delete_callback: Callable):
        """ :param delete_callback: Callable - function from parent which
        perform deletion """
        self._delete_callback: Callable = delete_callback
        self._auto_delete_timer: Optional[Timer] = None
        # start auto deleting timer, he will be cancelled when somebody
        # connect
        self.start_auto_delete_timer()

    def start_auto_delete_timer(self):
        """ start Timer deleting self after some time """
        self._auto_delete_timer = Timer(
            MATCH_DELETE_TIMEOUT, self._delete_callback)
        self._auto_delete_timer.daemon = True
        self._auto_delete_timer.start()

    def cancel_auto_delete_timer(self):
        """ safe cancel timer trying to delete this object """
        if self._auto_delete_timer is not None:
            self._auto_delete_timer.cancel()
            self._auto_delete_timer = None
