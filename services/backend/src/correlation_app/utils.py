import numpy as np
from scipy.signal import correlate as scipy_correlate


def correlate(signal_1, signal_2):
    correlation = scipy_correlate(signal_1, signal_2, mode='full')
    return correlation
