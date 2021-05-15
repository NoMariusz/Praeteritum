from rest_framework.views import APIView, Response
from rest_framework import status, permissions
from django.contrib.auth.models import User

from .logic.searching.MatchFinder import MatchFinder
from .models import MatchInformation
from .serializers import RunningMatchSerializer


class CancelFindMatch(APIView):
    def post(self, request, format=None):
        user: User = request.user
        MatchFinder.cancel(for_player=user)
        return Response(
            {'message': 'cancel finding match'}, status=status.HTTP_200_OK)


class IsFindingMatch(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """ return if actual finding match for user """
        user: User = request.user
        is_finding = MatchFinder.isFinding(for_player=user)
        return Response(
            {'result': is_finding}, status=status.HTTP_200_OK)


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
