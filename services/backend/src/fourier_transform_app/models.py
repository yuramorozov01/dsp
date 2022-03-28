from django.contrib.auth import get_user_model
from django.core.validators import validate_comma_separated_integer_list
from django.db import models


class FourierTransformResult(models.Model):
    """
    Fourier transform result model.
    This model contains fourier transformation results.
    Task ID is equivalent to celery result.
    """

    author = models.ForeignKey(
        get_user_model(),
        verbose_name='Author',
        on_delete=models.CASCADE,
        related_name='fourier_transform_results',
        null=True
    )
    amplitudes = models.CharField(
        'Amplitudes',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    frequencies = models.CharField(
        'Frequencies',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    started_calc_at = models.DateTimeField('Calculating start time', auto_now_add=True)
    task_id = models.CharField('Task ID', max_length=255, unique=True)

    class Meta:
        ordering = ['-started_calc_at']
        verbose_name = 'Fourier transformation result'
        verbose_name_plural = 'Fourier transformation results'

    def __str__(self):
        return f'{self.author}: ' \
               f'Amplitudes {self.amplitudes} | ' \
               f'Frequencies {self.frequencies} | ' \
               f'Task ID {self.task_id}'
