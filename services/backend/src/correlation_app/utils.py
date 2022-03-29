from scipy.signal import correlate as scipy_correlate

import numpy as np


def correlate(signal_1, signal_2):
    correlation = scipy_correlate(signal_1, signal_2, mode='full')
    return correlation
