from harmonic_signal_app.models import HarmonicSignalResult
from harmonic_signal_app.serializers import HarmonicSignalResultCreateSerializer
from harmonic_signal_app.tasks import CalcHarmonicSignalTask
from ws_app.consumers.celery_result import CeleryResultConsumer


class HarmonicSignalResultConsumer(CeleryResultConsumer):
    class Meta:
        model = HarmonicSignalResult
        serializer_class = HarmonicSignalResultCreateSerializer
        calculation_task_class = CalcHarmonicSignalTask
