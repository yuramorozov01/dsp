from base_app.serializers import CustomUserSerializer
from correlation_app.models import ImageCorrelationResult
from rest_framework import serializers


class ImageCorrelationResultCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating image correlation result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = ImageCorrelationResult
        fields = '__all__'
        read_only_fields = ['author', 'started_calc_at', 'task_id']


class ImageCorrelationResultDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for receiving details about image correlation result.
    """

    author = CustomUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = ImageCorrelationResult
        fields = ['id', 'author', 'image_1', 'image_2', 'started_calc_at', 'task_id']
        read_only_fields = ['id', 'author', 'image_1', 'image_2', 'started_calc_at', 'task_id']
