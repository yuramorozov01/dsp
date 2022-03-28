from base_app.serializers import CustomUserSerializer
from fourier_transform_app.models import FourierTransformResult
from rest_framework import serializers


class FourierTransformResultCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating fourier transform result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = FourierTransformResult
        fields = '__all__'
        read_only_fields = ['author', 'started_calc_at', 'task_id']


class FourierTransformResultDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for receiving details about fourier transform result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = FourierTransformResult
        fields = ['id', 'author', 'amplitudes', 'frequencies', 'started_calc_at', 'task_id']
        read_only_fields = ['id', 'author', 'amplitudes', 'frequencies', 'started_calc_at', 'task_id']
