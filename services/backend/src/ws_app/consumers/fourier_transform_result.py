from fourier_transform_app.models import FourierTransformResult
from fourier_transform_app.serializers import FourierTransformResultCreateSerializer
from fourier_transform_app.tasks import CalcFourierTransformTask
from ws_app.consumers.celery_result import CeleryResultConsumer


class FourierTransformResultConsumer(CeleryResultConsumer):
    class Meta:
        model = FourierTransformResult
        serializer_class = FourierTransformResultCreateSerializer
        calculation_task_class = CalcFourierTransformTask
