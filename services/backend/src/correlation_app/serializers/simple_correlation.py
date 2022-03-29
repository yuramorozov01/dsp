from base_app.serializers import CustomUserSerializer
from correlation_app.models import SimpleCorrelationResult
from rest_framework import serializers


class SimpleCorrelationResultCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating simple correlation result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = SimpleCorrelationResult
        fields = '__all__'
        read_only_fields = ['author', 'started_calc_at', 'task_id']


class SimpleCorrelationResultDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for receiving details about simple correlation result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = SimpleCorrelationResult
        fields = ['id', 'author', 'amplitudes_signal_1', 'frequencies_signal_1', 'amount_of_points_signal_1',
                  'amplitudes_signal_2', 'frequencies_signal_2', 'amount_of_points_signal_2', 'started_calc_at',
                  'task_id']
        read_only_fields = ['id', 'author', 'amplitudes_signal_1', 'frequencies_signal_1', 'amount_of_points_signal_1',
                            'amplitudes_signal_2', 'frequencies_signal_2', 'amount_of_points_signal_2',
                            'started_calc_at', 'task_id']
