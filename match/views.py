from rest_framework.views import APIView, Response
from rest_framework import status
from .utils.MatchFinder import MatchFinder
from .utils.MatchManager import match_manager
from asgiref.sync import sync_to_async
from django.http import HttpResponse
import asyncio
import json


def setAsync(fun):
    fun._is_coroutine = asyncio.coroutines._is_coroutine
    return fun


@sync_to_async
def get_user_from_request(request):
    ''' Function returns request.user as async '''
    return request.user if bool(request.user) else None


@setAsync
async def find_match(request):
    user = await get_user_from_request(request)
    finder = MatchFinder(user)
    match_id = await finder.find_match()
    if (match_id is not None):
        return HttpResponse(
            json.dumps({"match_id": match_id}), status=status.HTTP_200_OK)
    return HttpResponse(
        {"error": "MatchFinder not find any match"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


class CancelFindMatch(APIView):
    def post(self, request, format=None):
        user = request.user
        print('math.views CancelFindMatch')
        MatchFinder.cancel(for_player=user)
        return Response(
            {'message': 'cancel finding match'}, status=status.HTTP_200_OK)


class ConnectToMatch(APIView):
    lookup_url_kwarg = 'match-id'

    def get(self, request, format=None):
        # temporary
        match_id = request.GET.get(self.lookup_url_kwarg)
        players = str(match_manager.get_match_by_id(match_id).players)
        return Response({'players': players}, status=status.HTTP_200_OK)
