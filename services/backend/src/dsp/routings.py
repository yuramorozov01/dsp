from django.urls import re_path

from base_app.consumers import ClientConsumer

websocket_urlpatterns = [
    re_path(r'ws/$', ClientConsumer.as_asgi()),
]
