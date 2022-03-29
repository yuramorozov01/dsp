from itertools import zip_longest


def equalize_length_of_arrays(fill_value, *args):
    return tuple(zip(*zip_longest(*args, fillvalue=fill_value)))
