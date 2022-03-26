import json

from harmonic_signal_app.models import HarmonicSignalResult
from base_app.tasks import SendTaskResultTask

from ws_app.consumers.celery_result import CeleryResultConsumer


class HarmonicSignalResultConsumer(CeleryResultConsumer):
    def connect(self):
        self.create_username_group()
        task_id = self.scope['url_route']['kwargs']['task_id']
        if self.is_task_exists(HarmonicSignalResult, task_id):
            SendTaskResultTask().apply_async(
                args=[
                    task_id,
                    self.group_name,
                ]
            )
        self.accept()
        # self.send(text_data=json.dumps({
        #     'task_id': task_id,
        #     'username': username,
        # }))

