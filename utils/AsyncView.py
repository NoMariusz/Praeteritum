import asyncio
from asgiref.sync import sync_to_async
from django.views import View
from django.utils.decorators import classonlymethod


class AsyncView(View):
    @classonlymethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view._is_coroutine = asyncio.coroutines._is_coroutine
        return view

    @sync_to_async
    def get_user_from_request(self, request):
        ''' Function returns request.user as async '''
        return request.user if bool(request.user) else None
