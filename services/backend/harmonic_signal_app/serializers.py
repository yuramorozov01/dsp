from harmonic_signal_app.models import HarmonicSignalResult
from rest_framework import serializers
from base_app.serializers import CustomUserSerializer, CeleryTaskResultShortDetails, CeleryTaskResult


class HarmonicSignalResultCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating harmonic signal result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = HarmonicSignalResult
        fields = '__all__'
        read_only_fields = ['author', 'started_calc_at', 'task_id']


class HarmonicSignalResultDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for receiving details about harmonic signal result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = HarmonicSignalResult
        fields = ['id', 'author', 'amplitude', 'frequency', 'initial_phase', 'started_calc_at', 'task_id']
        read_only_fields = ['id', 'author', 'amplitude', 'frequency', 'initial_phase', 'started_calc_at', 'task_id']
