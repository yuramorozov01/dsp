import os

from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dsp.settings')

app = Celery('dsp')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.task_routes = {
    'send_task_result_task': {
        'queue': 'send_task',
    },
    'calc_harmonic_signal_task': {
        'queue': 'calc_task',
    },
    'calc_fourier_transform_task': {
        'queue': 'calc_task',
    },
}
