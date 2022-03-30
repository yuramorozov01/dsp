import os

import cv2
import numpy as np
from base_app.utils import get_unique_filename_by_task_id
from django.conf import settings
from scipy.signal import correlate as scipy_correlate
from scipy.signal import fftconvolve


def get_unique_filename_for_task_result(instance, filename):
    return get_unique_filename_by_task_id(instance.task_id, filename)


def correlate(signal_1, signal_2):
    correlation = scipy_correlate(signal_1, signal_2, mode='full')
    return correlation


def get_axes_of_image(image_data):
    x = np.arange(image_data.shape[1])
    y = np.arange(image_data.shape[0])
    x, y = np.meshgrid(x, y)
    z = image_data.reshape(x.shape)
    return x, y, z


def load_image(image_path):
    loaded_image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    cv2.cvtColor(loaded_image, cv2.COLOR_BGR2RGB, loaded_image)
    return loaded_image


def normxcorr2(template, image, mode="full"):
    template = template - np.mean(template)
    image = image - np.mean(image)

    a1 = np.ones(template.shape)

    ar = np.flipud(np.fliplr(template))
    out = fftconvolve(image, ar.conj(), mode=mode)

    image = fftconvolve(np.square(image), a1, mode=mode) - \
        np.square(fftconvolve(image, a1, mode=mode)) / (np.prod(template.shape))

    image[np.where(image < 0)] = 0

    template = np.sum(np.square(template))
    out = out / np.sqrt(image * template)

    out[np.where(np.logical_not(np.isfinite(out)))] = 0

    return out


def normalize_image(image):
    normalized = cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
    normalized = normalized.astype(np.uint8)
    return normalized


def correlate_images(im_1, im_2):
    im_1_copy_np = np.array(im_1.copy())
    im_2_copy_np = np.array(im_2.copy())

    im_1_copy_np = cv2.cvtColor(im_1_copy_np, cv2.COLOR_RGB2GRAY)
    im_2_copy_np = cv2.cvtColor(im_2_copy_np, cv2.COLOR_RGB2GRAY)

    corr_res = normxcorr2(im_2_copy_np, im_1_copy_np, mode='same')

    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(corr_res)

    w, h = im_2_copy_np.shape[::-1]

    top_left = max_loc
    top_left = (top_left[0] - w // 2, top_left[1] - h // 2)

    bottom_right = (top_left[0] + w, top_left[1] + h)

    image_1_with_found_area = np.array(im_1.copy())
    cv2.rectangle(image_1_with_found_area, top_left, bottom_right, (255, 0, 0), 10)

    return corr_res, image_1_with_found_area


def save_image(image_path, image):
    full_path = os.path.join(settings.MEDIA_ROOT, image_path)
    status = cv2.imwrite(full_path, image)
    return status


def get_rgb_2_bgr_image(image):
    return cv2.cvtColor(image, cv2.COLOR_RGB2BGR)


def get_saved_image_url(image_path):
    return '{}{}'.format(settings.MEDIA_URL, image_path)
