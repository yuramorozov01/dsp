from celery import Task as CeleryTask
from celery.result import AsyncResult
from dsp.celery import app
from django_celery_results.models import TaskResult
from ws_app.consts import WS_TASK_READY_EVENT_KEY
from ws_app.utils import send_ws_notification_to_groups
from harmonic_signal_app.models import HarmonicSignalResult
from fourier_transform_app.models import FourierTransformResult
from correlation_app.models import ImageCorrelationResult, SimpleCorrelationResult


class SendTaskResultTask(CeleryTask):
    name = 'send_task_result_task'

    def run(self, *args, task_id='', group_name=''):
        task_result = AsyncResult(task_id)
        send_ws_notification_to_groups(
                [group_name],
                WS_TASK_READY_EVENT_KEY,
                {
                    'task_id': task_result.task_id,
                    'status': task_result.status,
                    'result': task_result.result,
                }
            )
        return task_result.status


class ClearUnsavedTaskResultsTask(CeleryTask):
    def run(self, *args, **kwargs):
        task_results_models = [
            HarmonicSignalResult,
            FourierTransformResult,
            ImageCorrelationResult,
            SimpleCorrelationResult,
        ]
        task_results_union = task_results_models[0].objects.only('id', 'task_id')
        if len(task_results_models) >= 2:
            task_results_union = \
                task_results_union.union(*[model.objects.only('id', 'task_id') for model in task_results_models[1:]])

        task_ids = task_results_union.values_list('task_id')
        tasks_to_clear = TaskResult.objects.exclude(task_id__in=task_ids)
        return tasks_to_clear.delete()


app.register_task(SendTaskResultTask)
app.register_task(ClearUnsavedTaskResultsTask)
