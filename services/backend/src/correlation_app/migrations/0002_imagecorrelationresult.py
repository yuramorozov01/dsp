# Generated by Django 4.0.3 on 2022-03-30 15:34

import correlation_app.utils
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('correlation_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageCorrelationResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_1', models.ImageField(upload_to=correlation_app.utils.get_unique_filename_for_task_result, verbose_name='Image 1')),
                ('image_2', models.ImageField(upload_to=correlation_app.utils.get_unique_filename_for_task_result, verbose_name='Image 2')),
                ('started_calc_at', models.DateTimeField(auto_now_add=True, verbose_name='Calculating start time')),
                ('task_id', models.CharField(max_length=255, unique=True, verbose_name='Task ID')),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='image_correlation_results', to=settings.AUTH_USER_MODEL, verbose_name='Author')),
            ],
            options={
                'verbose_name': 'Image correlation result',
                'verbose_name_plural': 'Image correlation results',
                'ordering': ['-started_calc_at'],
            },
        ),
    ]
