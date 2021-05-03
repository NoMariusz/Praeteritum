from rest_framework import serializers
from django.contrib.auth.models import User


class UserInformationShort(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(
        format="%Y-%m-%d", required=False, read_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "date_joined")
