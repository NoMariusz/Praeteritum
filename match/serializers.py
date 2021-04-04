from rest_framework import serializers
from authentication.serializers import UserNameSerializer
from .models import MatchInformation


class RunningMatchSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    players = UserNameSerializer(read_only=True, many=True)

    class Meta:
        model = MatchInformation
        fields = ("id", "players")
