from celery import Task as CeleryTask
from dsp.celery import app
from harmonic_signal_app.utils import generate_harmonic_signal


class CalcHarmonicSignalTask(CeleryTask):
    name = 'calc_harmonic_signal_task'

    def run(self, *args, amplitude=0, frequency=0, initial_phase=0):
        harmonic_values = generate_harmonic_signal(amplitude, frequency, initial_phase)
        return {
            'harmonic_values': harmonic_values.tolist(),
        }


app.register_task(CalcHarmonicSignalTask)
