import json

from django.shortcuts import redirect
from rest_framework.views import APIView, Response
from rest_framework import generics, status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse

from .serializers import UserSerializer, CreateUserSerializer
from .utils import create_user
from utils.AsyncView import AsyncView
from utils.asyncs import run_as_async


class RegisterUser(AsyncView):
    serializer_class = CreateUserSerializer

    async def post(self, request, format=None):
        """ Async because it took time to register user """
        serializer = self.serializer_class(
            data=await run_as_async(json.loads, request.body))
        if await run_as_async(serializer.is_valid):
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            email = serializer.validated_data["email"]

            user = await create_user(
                username=username, password=password, email=email)

            # auto login after create user
            user = await run_as_async(
                authenticate, request, username=username, password=password)
            if user is not None:
                await run_as_async(login, request, user)

            return HttpResponse(
                json.dumps({"message": "User created"}),
                status=status.HTTP_201_CREATED
            )

        return HttpResponse(
            json.dumps({"error": serializer.errors}),
            status=status.HTTP_400_BAD_REQUEST
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
