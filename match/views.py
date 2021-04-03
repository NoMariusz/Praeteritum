import json

from rest_framework.views import APIView, Response
from rest_framework import status, permissions
from django.http import HttpResponse
from django.contrib.auth.models import User

from .logic.searching.MatchFinder import MatchFinder
from .models import MatchInformation
from .serializers import RunningMatchSerializer
from utils.AsyncView import AsyncView


class FindMatch(AsyncView):
    async def post(self, request, format=None):
        user: User = await self.get_user_from_request(request)
        finder = MatchFinder(user)
        match_id: int = await finder.find_match()

        if match_id is not None:
            return HttpResponse(
                json.dumps({"match_id": match_id}), status=status.HTTP_200_OK)
        return HttpResponse(
            json.dumps({
                "status": "MatchFinder can not find any match, probably"
                + " cancelled finding"
            }),
            status=status.HTTP_404_NOT_FOUND
        )


class CancelFindMatch(APIView):
    def post(self, request, format=None):
        user: User = request.user
        MatchFinder.cancel(for_player=user)
        return Response(
            {'message': 'cancel finding match'}, status=status.HTTP_200_OK)


class ActiveMatches(APIView):
    serializer_class = RunningMatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """ get running match ids for player """
        user: User = request.user

        user_active_matches = MatchInformation.objects.filter(
            players=user, status=MatchInformation.Statuses.RUNNING)
        serializer = RunningMatchSerializer(
            user_active_matches, read_only=True, many=True)

        return Response(
            {'active_matches': serializer.data},
            status=status.HTTP_200_OK)
