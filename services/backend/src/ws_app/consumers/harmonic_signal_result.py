from harmonic_signal_app.models import HarmonicSignalResult
from ws_app.consumers.celery_result import CeleryResultConsumer


class HarmonicSignalResultConsumer(CeleryResultConsumer):
    def connect(self):
        self.create_username_group()
        self.accept()
        task_id = self.scope['url_route']['kwargs']['task_id']
        self.send_task_result(HarmonicSignalResult, task_id)

    def receive_json(self, content, **kwargs):
        task_id = content.get('task_id', '')
        self.send_task_result(HarmonicSignalResult, task_id)
