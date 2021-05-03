from rest_framework import serializers
from django.contrib.auth.models import User


class UserInformationShort(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "date_joined")
