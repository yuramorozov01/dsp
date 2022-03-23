from celery import Task as CeleryTask
from dsp.celery import app
from harmonic_signal_app.utils import generate_harmonic_signal
from time import sleep


class CalcHarmonicSignalTask(CeleryTask):
    name = 'calc_harmonic_signal_task'

    def run(self, amplitude, frequency, initial_phase, *args, **kwargs):
        harmonic_values = generate_harmonic_signal(amplitude, frequency, initial_phase)
        # ToDo:
        # 1. Send after generating harmonic signal values to
        return list(harmonic_values)


app.register_task(CalcHarmonicSignalTask)
