from correlation_app.utils import get_unique_filename_for_task_result

from django.contrib.auth import get_user_model
from django.db import models


class ImageCorrelationResult(models.Model):
    """
    Image correlation (2-dimension signal) result model.
    This model contains image correlation results.
    Task ID is equivalent to celery result.
    """

    author = models.ForeignKey(
        get_user_model(),
        verbose_name='Author',
        on_delete=models.CASCADE,
        related_name='image_correlation_results',
        null=True
    )

    image_1 = models.ImageField('Image 1', upload_to=get_unique_filename_for_task_result)
    image_2 = models.ImageField('Image 2', upload_to=get_unique_filename_for_task_result)

    started_calc_at = models.DateTimeField('Calculating start time', auto_now_add=True)
    task_id = models.CharField('Task ID', max_length=255, unique=True)

    class Meta:
        ordering = ['-started_calc_at']
        verbose_name = 'Image correlation result'
        verbose_name_plural = 'Image correlation results'

    def __str__(self):
        return f'{self.author}: ' \
               f'Image 1 {self.image_1.url} ({self.image_1.size}) | ' \
               f'Image 2 {self.image_2.url} ({self.image_2.size}) | ' \
               f'Task ID {self.task_id}'
