# Generated by Django 4.0.3 on 2022-03-23 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('harmonic_signal_app', '0003_alter_harmonicsignalresult_author'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='harmonicsignalresult',
            name='celery_result',
        ),
        migrations.AddField(
            model_name='harmonicsignalresult',
            name='task_id',
            field=models.CharField(default=44, max_length=255, verbose_name='Task ID'),
            preserve_default=False,
        ),
    ]
