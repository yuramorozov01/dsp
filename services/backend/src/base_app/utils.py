from itertools import zip_longest

import uuid


def get_unique_filename_by_task_id(task_id, filename):
    ext = filename.split('.')[-1]
    filename = '{}.{}'.format(uuid.uuid4(), ext)
    return 'task_{0}/{1}'.format(task_id, filename)


def equalize_length_of_arrays(fill_value, *args):
    return tuple(zip(*zip_longest(*args, fillvalue=fill_value)))
