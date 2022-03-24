from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models


class HarmonicSignalResult(models.Model):
    """
    Harmonic signal result model.
    This model contains harmonic signal results.
    Here is foreign key on base result with celery result.
    """

    author = models.ForeignKey(
        get_user_model(),
        verbose_name='Author',
        on_delete=models.CASCADE,
        related_name='harmonic_signal_results',
        null=True
    )
    amplitude = models.IntegerField(
        'Amplitude',
        validators=[MinValueValidator(0)]
    )
    frequency = models.IntegerField(
        'Frequency',
        validators=[MinValueValidator(0)]
    )
    initial_phase = models.FloatField(
        'Initial phase'
    )
    started_calc_at = models.DateTimeField('Calculating start time', auto_now_add=True)
    task_id = models.CharField('Task ID', max_length=255, unique=True)

    class Meta:
        ordering = ['-started_calc_at']
        verbose_name = 'Harmonic signal result'
        verbose_name_plural = 'Harmonic signal results'

    def __str__(self):
        return f'{self.author}: ' \
               f'Amplitude {self.amplitude} | ' \
               f'Frequency {self.frequency} | ' \
               f'Initial phase {self.initial_phase:.2f} | ' \
               f'Task ID {self.task_id}'
