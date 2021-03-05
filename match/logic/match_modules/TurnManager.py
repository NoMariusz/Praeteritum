import random
import time
from datetime import datetime
from typing import Callable
from threading import Thread
from ...constatnts import TURN_TIME, TURN_STATUS_REFRESH_TIME


class TurnManager:
    """ manage Match turns by storing information about them, changing them at
    certain times and sending information to socket about changes """
    def __init__(
            self, send_to_sockets: Callable, on_turn_change_callback: Callable
            ):
        """ :param send_to_sockets: Callable - function from parent which
        enable sending messages to socket
        :param on_turn_change_callback: Callable - function to call when turn
        change """

        self._send_to_sockets = send_to_sockets
        self._on_turn_change_callback = on_turn_change_callback
        # turns related stuff
        self.player_turn: int = random.randint(0, 1)
        self.turn_progres: float = 0
        self._last_turn_start_time: datetime = datetime.now()

        self._live = True

        # start thread with timer to change turn
        self._turn_timer_thread: Thread = Thread(
            target=self._turn_timer, daemon=True)
        self._turn_timer_thread.start()

    def _turn_timer(self):
        """ function with main loop with changing turns """
        while self._live:
            # sleep task
            time.sleep(TURN_STATUS_REFRESH_TIME)
            # get how much time passes
            now: datetime = datetime.now()
            seconds_from_start: int = (
                now - self._last_turn_start_time).seconds
            # update progress
            self.turn_progres = seconds_from_start / TURN_TIME * 100

            if self.turn_progres >= 100:
                self.start_next_turn()

            self._send_progress_changed()

    def start_next_turn(self):
        # set next turn
        self.player_turn = 1 if self.player_turn == 0 else 0
        self._send_to_sockets_turn_change()
        # reset progres
        self.turn_progres = 0
        self._last_turn_start_time = datetime.now()
        # call function from parent
        self._on_turn_change_callback()

    def stop_turn_thread(self):
        # to break thread function loop
        self._live = False

    def _send_progress_changed(self):
        message = {
            'name': 'turn-progress-changed',
            'data': {
                'progress': self.turn_progres
            }
        }
        self._send_to_sockets(message, modify=False)

    def _send_to_sockets_turn_change(self):
        message = {
            'name': 'turn-changed',
            'data': {
                'turn': self.player_turn
            }
        }
        self._send_to_sockets(message, modify=False)
