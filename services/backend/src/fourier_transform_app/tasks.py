from celery import Task as CeleryTask
from dsp.celery import app
from fourier_transform_app.utils import (fft,
                                         generate_polyharmonic_signal,
                                         parse_params)


class CalcFourierTransformTask(CeleryTask):
    name = 'calc_fourier_transform_task'

    def run(self, *args, amplitudes='1,1', frequencies='2,2'):
        raw_amplitudes = amplitudes
        raw_frequencies = frequencies
        amplitudes, frequencies = parse_params(raw_amplitudes, raw_frequencies)

        time_size = 1024

        # fix for Nyquist–Shannon sampling theorem
        if max(frequencies) >= (time_size // 2):
            time_size = (max(frequencies) + 1) * 2

        time, result_values, harmonics_values = generate_polyharmonic_signal(time_size, amplitudes, frequencies)

        fft_values = fft(result_values)

        return {
            'time': time.tolist(),
            'result_values': result_values,
            'harmonics_values': harmonics_values,
            'fft_values': fft_values.tolist(),
        }


app.register_task(CalcFourierTransformTask)
