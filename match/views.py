from rest_framework.views import APIView, Response
# from django.contrib.auth.decorators import login_required
from rest_framework import status
from .utils.MatchFinder import MatchFinder
from .utils.MatchManager import match_manager


class FindMatch(APIView):
    # @login_required(login_url='/authentication/login/')
    def post(self, request, format=None):
        user = request.user
        finder = MatchFinder(user)
        match_id = finder.find_match()
        if (match_id is not None):
            return Response({"match_id": match_id}, status=status.HTTP_200_OK)
        return Response(
            {'error': 'match not found'}, status=status.HTTP_404_NOT_FOUND)


class CancelFindMatch(APIView):
    # @login_required(login_url='/authentication/login/')
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
