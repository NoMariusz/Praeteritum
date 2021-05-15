import json

from channels.generic.http import AsyncHttpConsumer
from django.contrib.auth.models import User
from ..logic.searching.MatchFinder import MatchFinder


class FindMatchConsumer(AsyncHttpConsumer):
    """ Search for Match and return result when found them by use
    AsyncHttpConsumer enabling to handle http request asynchronously """

    async def handle(self, body):
        user: User = self.scope["user"]
        # make finder
        finder = MatchFinder(user)

        # wait to math_finder try find match
        finding_results: dict = await finder.find_match()

        # praepare dict with responses for every finding_results status codes
        responses_to_result_codes: dict = {
            1: [
                201,
                json.dumps({
                    "match_id": finding_results["match_id"]
                }).encode("utf-8")
            ],
            4: [
                404,
                json.dumps({
                    "status":
                        "MatchFinder can not find any Match, probably" +
                        "cancelled finding"
                }).encode("utf-8")
            ],
            5: [
                503,
                json.dumps({
                    "status": "Not find any Match, searching time is over"
                }).encode("utf-8")
            ],
        }

        # send proper response depending on findig results
        await self.send_response(
            *responses_to_result_codes[finding_results["status_code"]])
