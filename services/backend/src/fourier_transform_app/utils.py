from itertools import zip_longest

import numpy as np


def equalize_length_of_arrays(fill_value, *args):
    return tuple(zip(*zip_longest(*args, fillvalue=fill_value)))


def generate_polyharmonic_signal(amount_of_points, amplitudes, frequencies):
    time = np.arange(0, amount_of_points, 1)

    harmonics_values = []
    for i in range(len(amplitudes)):
        harmonics_values.append(list(amplitudes[i] * np.sin(2 * np.pi * frequencies[i] * time / len(time))))

    result_values = []
    for j in time:
        res = 0
        for harmonic_values in harmonics_values:
            res += harmonic_values[j]
        result_values.append(res)

    return list(map(int, list(time))), result_values, harmonics_values
