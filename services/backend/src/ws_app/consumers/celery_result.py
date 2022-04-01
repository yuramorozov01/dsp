from uuid import uuid4

from asgiref.sync import async_to_sync
from base_app.tasks import SendTaskResultTask
from channels.generic.websocket import JsonWebsocketConsumer
from django_celery_results.models import TaskResult
from ws_app.consts import WS_TASK_READY_EVENT_KEY, WS_ERROR_EVENT_KEY

from ws_app.utils import send_ws_notification_to_groups


class CeleryResultConsumer(JsonWebsocketConsumer):
    def create_username_group(self):
        username = str(uuid4())
        if self.scope['user'].is_authenticated:
            username = self.scope['user'].username
        self.group_name = f'{WS_TASK_READY_EVENT_KEY}_{username}'
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

    def connect(self):
        self.create_username_group()
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive_json(self, content, **kwargs):
        methods = {
            'GET': self.get,
            'CREATE': self.create,
        }

        handler = methods.get(content.get('method', ''))
        if handler is None:
            self.send_error_message('Unknown method!')
            return

        body = content.get('body')
        if body is None:
            self.send_error_message('Message body is not specified!')
            return

        handler(body)

    def get(self, body):
        task_id = body.get('task_id', '')
        self.send_task_result(task_id)

    def create(self, body):
        pass

    def task_ready_event(self, event):
        self.send_json(content=event)

    def error_event(self, event):
        self.send_json(content=event)

    def is_task_exists(self, task_id):
        model = getattr(self.Meta, 'model', TaskResult)
        return model.objects.filter(task_id=task_id).exists()

    def send_task_result(self, task_id):
        if self.is_task_exists(task_id):
            SendTaskResultTask().apply_async(
                kwargs={
                    'task_id': task_id,
                    'group_name': self.group_name,
                }
            )
        else:
            self.send_error_message('Unknown task ID')

    def send_error_message(self, error_message):
        send_ws_notification_to_groups([self.group_name], WS_ERROR_EVENT_KEY, {'error_msg': error_message})
