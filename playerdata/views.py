from rest_framework import status, permissions
from rest_framework.views import APIView, Response

from .serializers import UserInformationShort


class AccountData(APIView):
    """ return short information about account """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        user_serializer = UserInformationShort(user)
        return Response(
            {'data': user_serializer.data}, status=status.HTTP_200_OK)
