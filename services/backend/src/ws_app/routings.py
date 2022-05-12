from django.urls import path
from ws_app.consumers import (FourierTransformResultConsumer,
                              HarmonicSignalResultConsumer,
                              ImageCorrelationResultConsumer,
                              SimpleCorrelationResultConsumer)

websocket_urlpatterns = [
    path('ws/harmonic_signal_result/', HarmonicSignalResultConsumer.as_asgi()),
    path('ws/fourier_transform_result/', FourierTransformResultConsumer.as_asgi()),
    path('ws/simple_correlation_result/', SimpleCorrelationResultConsumer.as_asgi()),
    path('ws/image_correlation_result/', ImageCorrelationResultConsumer.as_asgi()),
]
