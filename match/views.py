import json

from rest_framework.views import APIView, Response
from rest_framework import status
from django.http import HttpResponse

from .utils.MatchFinder import MatchFinder
from utils.AsyncView import AsyncView


class FindMatch(AsyncView):
    async def post(self, request, format=None):
        user = await self.get_user_from_request(request)
        # print("user %s" % user)
        finder = MatchFinder(user)
        match_id = await finder.find_match()

        if match_id is not None:
            return HttpResponse(
                json.dumps({"match_id": match_id}), status=status.HTTP_200_OK)
        return HttpResponse(
            json.dumps({"error": "MatchFinder not find any match"}),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class CancelFindMatch(APIView):
    def post(self, request, format=None):
        user = request.user
        print('math.views CancelFindMatch')
        MatchFinder.cancel(for_player=user)
        return Response(
            {'message': 'cancel finding match'}, status=status.HTTP_200_OK)
