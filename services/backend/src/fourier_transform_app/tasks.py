from celery import Task as CeleryTask
from dsp.celery import app
from fourier_transform_app.utils import (equalize_length_of_arrays,
                                         generate_polyharmonic_signal)


class CalcFourierTransformTask(CeleryTask):
    name = 'calc_fourier_transform_task'

    def run(self, amplitudes, frequencies, *args, **kwargs):
        amplitudes = [int(item) for item in amplitudes.split(',')]
        frequencies = [int(item) for item in frequencies.split(',')]
        amplitudes, frequencies = equalize_length_of_arrays(0, amplitudes, frequencies)

        time_size = 1024

        # fix for Nyquist–Shannon sampling theorem
        if max(frequencies) >= (time_size // 2):
            time_size = (max(frequencies) + 1) * 2

        time, result_values, harmonics_values = generate_polyharmonic_signal(time_size, amplitudes, frequencies)
        return {
            'time': list(time),
            'result_values': result_values,
            'harmonics_values': harmonics_values,
        }


app.register_task(CalcFourierTransformTask)
