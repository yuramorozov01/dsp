from correlation_app.models import (ImageCorrelationResult,
                                    SimpleCorrelationResult)
from ws_app.consumers.celery_result import CeleryResultConsumer


class SimpleCorrelationResultConsumer(CeleryResultConsumer):
    class Meta:
        model = SimpleCorrelationResult


class ImageCorrelationResultConsumer(CeleryResultConsumer):
    class Meta:
        model = ImageCorrelationResult
