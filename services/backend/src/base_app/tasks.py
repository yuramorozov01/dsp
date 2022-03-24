from celery import Task as CeleryTask
from dsp.celery import app


class SendTaskResultTask(CeleryTask):
    name = 'send_task_result_task'

    def run(self, task_id, groups, *args, **kwargs):
        return True


app.register_task(SendTaskResultTask)
