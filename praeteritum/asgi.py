"""
ASGI config for praeteritum project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.urls.conf import re_path
from django.core.asgi import get_asgi_application


# Fetch Django ASGI application early to ensure AppRegistry is populated
# before importing consumers and AuthMiddlewareStack that may import ORM
# models.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "praeteritum.settings")
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from match.routing import websocket_urlpatterns, http_urlpatterns


application = ProtocolTypeRouter({
    # handle traditional HTTP requests
    "http": AuthMiddlewareStack(
        URLRouter([
            *http_urlpatterns,
            re_path(r"", django_asgi_app),
        ])
    ),

    # handle websockets
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
