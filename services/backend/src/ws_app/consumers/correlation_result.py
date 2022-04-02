from correlation_app.models import (ImageCorrelationResult,
                                    SimpleCorrelationResult)
from correlation_app.serializers import (ImageCorrelationResultCreateSerializer,
                                         SimpleCorrelationResultCreateSerializer)
from correlation_app.tasks import (CalcImageCorrelationTask,
                                   CalcSimpleCorrelationTask)
from ws_app.consumers.celery_result import CeleryResultConsumer


class SimpleCorrelationResultConsumer(CeleryResultConsumer):
    class Meta:
        model = SimpleCorrelationResult
        serializer_class = SimpleCorrelationResultCreateSerializer
        calculation_task_class = CalcSimpleCorrelationTask


class ImageCorrelationResultConsumer(CeleryResultConsumer):
    class Meta:
        model = ImageCorrelationResult
        serializer_class = ImageCorrelationResultCreateSerializer
        calculation_task_class = CalcImageCorrelationTask
