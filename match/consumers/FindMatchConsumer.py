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
        # wait to math_finder find match
        match_id: int = await finder.find_match()

        # send response
        if match_id is not None:
            await self.send_response(
                200, json.dumps({"match_id": match_id}).encode("utf-8"))
        await self.send_response(
            404, json.dumps({
                "status": "MatchFinder can not find any match, probably"
                + " cancelled finding"
            }).encode("utf-8"))
