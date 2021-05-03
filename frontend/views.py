from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")


@login_required
def logged_index(request, *args, **kwargs):
    return render(request, "frontend/index.html")
