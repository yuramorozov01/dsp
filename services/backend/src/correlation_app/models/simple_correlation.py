from django.contrib.auth import get_user_model
from django.core.validators import (MinValueValidator,
                                    validate_comma_separated_integer_list)
from django.db import models


class SimpleCorrelationResult(models.Model):
    """
    Simple correlation (1-dimension signal) result model.
    This model contains simple correlation results.
    Task ID is equivalent to celery result.
    """

    author = models.ForeignKey(
        get_user_model(),
        verbose_name='Author',
        on_delete=models.CASCADE,
        related_name='simple_correlation_results',
        null=True
    )

    amplitudes_signal_1 = models.CharField(
        'Amplitudes in signal 1',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    frequencies_signal_1 = models.CharField(
        'Frequencies in signal 1',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    amount_of_points_signal_1 = models.IntegerField(
        'Amount of points in signal 1',
        validators=[MinValueValidator(0)]
    )

    amplitudes_signal_2 = models.CharField(
        'Amplitudes in signal 2',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    frequencies_signal_2 = models.CharField(
        'Frequencies in signal 2',
        validators=[validate_comma_separated_integer_list],
        max_length=1024
    )
    amount_of_points_signal_2 = models.IntegerField(
        'Amount of points in signal 2',
        validators=[MinValueValidator(0)]
    )

    started_calc_at = models.DateTimeField('Calculating start time', auto_now_add=True)
    task_id = models.CharField('Task ID', max_length=255, unique=True)

    class Meta:
        ordering = ['-started_calc_at']
        verbose_name = 'Simple correlation result'
        verbose_name_plural = 'Simple correlation results'

    def __str__(self):
        return f'{self.author}: ' \
               f'Amplitudes in signal 1 {self.amplitudes_signal_1} | ' \
               f'Frequencies in signal 1 {self.frequencies_signal_1} | ' \
               f'Amount of points in signal 1 {self.amount_of_points_signal_1} | ' \
               f'Amplitudes in signal 2 {self.amplitudes_signal_2} | ' \
               f'Frequencies in signal 2 {self.frequencies_signal_2} | ' \
               f'Amount of points in signal 2 {self.amount_of_points_signal_2} | ' \
               f'Task ID {self.task_id}'
