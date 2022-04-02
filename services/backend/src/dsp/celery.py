import os

from celery import Celery
from celery.schedules import crontab

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

# Configure scheduled tasks
app.conf.beat_schedule = {
    'every-5-min-clear-unsaved-tasks': {
        'task': 'base_app.tasks.ClearUnsavedTaskResultsTask',
        'schedule': crontab(minute='*/5'),
    },
}

# Configure task routing
app.conf.task_routes = {
    'send_task_result_task': {
        'queue': 'utils',
        'priority': 2,
    },
    'base_app.tasks.ClearUnsavedTaskResultsTask': {
        'queue': 'utils',
        'priority': 4,
    },
    'calc_harmonic_signal_task': {
        'queue': 'calc_task',
    },
    'calc_fourier_transform_task': {
        'queue': 'calc_task',
    },
    'calc_simple_correlation_task': {
        'queue': 'calc_task',
    },
    'calc_image_correlation_task': {
        'queue': 'calc_task',
    },
}
