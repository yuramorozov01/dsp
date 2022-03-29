from django.urls import path
from ws_app.consumers import (FourierTransformResultConsumer,
                              HarmonicSignalResultConsumer,
                              SimpleCorrelationResultConsumer)

websocket_urlpatterns = [
    path('ws/harmonic_signal_result/<str:task_id>/', HarmonicSignalResultConsumer.as_asgi()),
    path('ws/fourier_transform_result/<str:task_id>/', FourierTransformResultConsumer.as_asgi()),
    path('ws/simple_correlation_result/<str:task_id>/', SimpleCorrelationResultConsumer.as_asgi()),
]
