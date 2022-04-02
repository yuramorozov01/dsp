from base_app.utils import get_unique_filename_by_task_id
from celery import Task as CeleryTask
from correlation_app.utils import (correlate_images, get_axes_of_image,
                                   get_rgb_2_bgr_image, get_saved_image_url,
                                   load_image, normalize_image, save_image)
from dsp.celery import app


class CalcImageCorrelationTask(CeleryTask):
    name = 'calc_image_correlation_task'

    def run(self, *args, image_1_path='', image_2_path='', task_id=''):

        image_1 = load_image(image_1_path)
        image_2 = load_image(image_2_path)

        correlation_result, image_1_with_found_area = correlate_images(image_1, image_2)

        path_to_save_correlation_result = get_unique_filename_by_task_id(task_id, image_1_path)
        save_image(path_to_save_correlation_result, normalize_image(correlation_result))
        path_to_save_image_1_with_found_area = get_unique_filename_by_task_id(task_id, image_1_path)
        save_image(path_to_save_image_1_with_found_area, get_rgb_2_bgr_image(image_1_with_found_area))

        x, y, z = get_axes_of_image(correlation_result)

        return {
            'correlation_result': get_saved_image_url(path_to_save_correlation_result),
            'image_1_with_found_area': get_saved_image_url(path_to_save_image_1_with_found_area),
            'axes': {
                'x': x.tolist(),
                'y': y.tolist(),
                'z': z.tolist(),
            },
        }


app.register_task(CalcImageCorrelationTask)
