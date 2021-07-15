import json

from django.shortcuts import redirect
from rest_framework import generics, status
from rest_framework.views import APIView, Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .serializers import UserSerializer, CreateUserSerializer
from .utils import create_user


class RegisterUser(APIView):
    """ View registering users to application """
    def post(self, request, format=None):
        # serialize data
        serializer = CreateUserSerializer(
            data=json.loads(request.body)
        )

        if serializer.is_valid():
            # create user object if all is ok
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            email = serializer.validated_data["email"]

            user = create_user(
                username=username, password=password, email=email)

            # auto login after create user
            user = authenticate(
                request, username=username, password=password)
            if user is not None:
                login(request, user)

            return Response(
                {"message": "User created"}, status=status.HTTP_201_CREATED
            )

        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class LoginUser(APIView):
    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(
                {"message": "logged successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "logged failed"}, status=status.HTTP_400_BAD_REQUEST
            )


class LogoutUser(APIView):
    def post(self, request, format=None):
        logout(request)
        return redirect("/")


class CheckAuthenticated(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response(
                {"isAuthenticated": True, "username": request.user.username},
                status=status.HTTP_200_OK
            )
        return Response({"isAuthenticated": False}, status=status.HTTP_200_OK)


class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
