from correlation_app.models import ImageCorrelationResult, SimpleCorrelationResult
from ws_app.consumers.celery_result import CeleryResultConsumer


class SimpleCorrelationResultConsumer(CeleryResultConsumer):
    def connect(self):
        self.create_username_group()
        self.accept()
        task_id = self.scope['url_route']['kwargs']['task_id']
        self.send_task_result(SimpleCorrelationResult, task_id)

    def receive_json(self, content, **kwargs):
        task_id = content.get('task_id', '')
        self.send_task_result(SimpleCorrelationResult, task_id)


class ImageCorrelationResultConsumer(CeleryResultConsumer):
    def connect(self):
        self.create_username_group()
        self.accept()
        task_id = self.scope['url_route']['kwargs']['task_id']
        self.send_task_result(ImageCorrelationResult, task_id)

    def receive_json(self, content, **kwargs):
        task_id = content.get('task_id', '')
        self.send_task_result(ImageCorrelationResult, task_id)
