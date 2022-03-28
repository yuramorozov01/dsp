import json
from uuid import uuid4

from asgiref.sync import async_to_sync
from base_app.tasks import SendTaskResultTask
from channels.generic.websocket import JsonWebsocketConsumer
from ws_app.consts import WS_TASK_READY_EVENT_KEY


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

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def task_ready_event(self, event):
        self.send_json(content=event)

    def is_task_exists(self, Model, task_id):
        return Model.objects.filter(task_id=task_id).exists()

    def find_task_result_and_send_it(self, Model, task_id):
        if self.is_task_exists(Model, task_id):
            SendTaskResultTask().apply_async(
                kwargs={
                    'task_id': task_id,
                    'group_name': self.group_name,
                    'error': False,
                    'error_msg': '',
                }
            )
        else:
            self.send_error_message('Unknown task ID')

    def send_error_message(self, error_message):
        self.send_json(content={
            'error': True,
            'error_msg': error_message,
        })
