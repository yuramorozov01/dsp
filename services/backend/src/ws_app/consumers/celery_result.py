import json

from asgiref.sync import async_to_sync


from ws_app.consts import WS_TASK_READY_EVENT_KEY
from channels.generic.websocket import WebsocketConsumer

from uuid import uuid4


class CeleryResultConsumer(WebsocketConsumer):
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
        self.send(text_data=json.dumps(event))

    def is_task_exists(self, Model, task_id):
        return Model.objects.filter(task_id=task_id).exists()
