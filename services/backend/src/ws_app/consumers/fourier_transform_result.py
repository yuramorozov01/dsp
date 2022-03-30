from fourier_transform_app.models import FourierTransformResult
from ws_app.consumers.celery_result import CeleryResultConsumer


class FourierTransformResultConsumer(CeleryResultConsumer):
    class Meta:
        model = FourierTransformResult
