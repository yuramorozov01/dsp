import numpy as np


def generate_harmonic_signal(amplitude, frequency, initial_phase):
    time = np.arange(0, 1024, 1)
    harmonic_values = amplitude * np.sin((2 * np.pi * frequency * time / len(time)) + initial_phase)
    return harmonic_values
