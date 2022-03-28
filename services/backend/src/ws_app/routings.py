from django.urls import path
from ws_app.consumers import HarmonicSignalResultConsumer

websocket_urlpatterns = [
    path('ws/harmonic_signal_result/<str:task_id>/', HarmonicSignalResultConsumer.as_asgi()),
]
