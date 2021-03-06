# Generated by Django 4.0.3 on 2022-03-23 10:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('harmonic_signal_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='harmonicsignalresult',
            options={'ordering': ['-started_calc_at'], 'verbose_name': 'Harmonic signal result', 'verbose_name_plural': 'Harmonic signal results'},
        ),
        migrations.AlterField(
            model_name='harmonicsignalresult',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='results', to=settings.AUTH_USER_MODEL, verbose_name='Author'),
        ),
    ]
