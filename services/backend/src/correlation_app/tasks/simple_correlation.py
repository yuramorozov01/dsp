from celery import Task as CeleryTask
from correlation_app.utils import correlate
from dsp.celery import app
from fourier_transform_app.utils import (generate_polyharmonic_signal,
                                         parse_params)


class CalcSimpleCorrelationTask(CeleryTask):
    name = 'calc_simple_correlation_task'

    def run(self,
            raw_amplitudes_signal_1,
            raw_frequencies_signal_1,
            amount_of_points_signal_1,
            raw_amplitudes_signal_2,
            raw_frequencies_signal_2,
            amount_of_points_signal_2,
            *args,
            **kwargs
        ):
        amplitudes_signal_1, frequencies_signal_1 = parse_params(raw_amplitudes_signal_1, raw_frequencies_signal_1)
        time_signal_1, result_values_signal_1, harmonics_values_signal_1 = generate_polyharmonic_signal(
            amount_of_points_signal_1,
            amplitudes_signal_1,
            frequencies_signal_1
        )

        amplitudes_signal_2, frequencies_signal_2 = parse_params(raw_amplitudes_signal_2, raw_frequencies_signal_2)
        time_signal_2, result_values_signal_2, harmonics_values_signal_2 = generate_polyharmonic_signal(
            amount_of_points_signal_2,
            amplitudes_signal_2,
            frequencies_signal_2
        )

        correlation = correlate(result_values_signal_1, result_values_signal_2)

        return {
            'signal_1': {
                'time': time_signal_1.tolist(),
                'result_values': result_values_signal_1,
            },
            'signal_2': {
                'time': time_signal_2.tolist(),
                'result_values': result_values_signal_2,
            },
            'correlation': correlation.tolist(),
        }


app.register_task(CalcSimpleCorrelationTask)
