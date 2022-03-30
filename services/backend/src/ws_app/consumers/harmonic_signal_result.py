from harmonic_signal_app.models import HarmonicSignalResult
from ws_app.consumers.celery_result import CeleryResultConsumer


class HarmonicSignalResultConsumer(CeleryResultConsumer):
    class Meta:
        model = HarmonicSignalResult
