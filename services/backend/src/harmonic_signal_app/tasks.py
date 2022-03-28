from celery import Task as CeleryTask
from dsp.celery import app
from harmonic_signal_app.utils import generate_harmonic_signal


class CalcHarmonicSignalTask(CeleryTask):
    name = 'calc_harmonic_signal_task'

    def run(self, amplitude, frequency, initial_phase, *args, **kwargs):
        harmonic_values = generate_harmonic_signal(amplitude, frequency, initial_phase)
        return {
            'harmonic_values': harmonic_values,
        }


app.register_task(CalcHarmonicSignalTask)
