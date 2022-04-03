import numpy as np
from base_app.utils import equalize_length_of_arrays


def parse_params(raw_amplitudes, raw_frequencies):
    amplitudes = [int(item) for item in raw_amplitudes.split(',')]
    frequencies = [int(item) for item in raw_frequencies.split(',')]
    amplitudes, frequencies = equalize_length_of_arrays(0, amplitudes, frequencies)
    return amplitudes, frequencies


def generate_polyharmonic_signal(amount_of_points, amplitudes, frequencies):
    time = np.arange(0, amount_of_points, 1)

    harmonics_values = []
    for i in range(len(amplitudes)):
        harmonics_values.append((amplitudes[i] * np.sin(2 * np.pi * frequencies[i] * time / len(time))).tolist())

    result_values = []
    for j in time:
        res = 0
        for harmonic_values in harmonics_values:
            res += harmonic_values[j]
        result_values.append(res)

    return time, result_values, harmonics_values


def fft(values):
    fft_values = np.fft.fft(values)
    int_fft_values = abs(fft_values)
    return int_fft_values[:(len(values) // 2)]
