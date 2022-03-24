from django.contrib.auth import get_user_model
from django_celery_results.models import TaskResult
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for an user
    """

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']


class CeleryTaskResultShortDetails(serializers.ModelSerializer):
    """
    Serializer for celery task result
    """

    class Meta:
        model = TaskResult
        fields = ['id', 'task_id', 'status']
        read_only_fields = ['id', 'task_id', 'status']


class CeleryTaskResult(serializers.ModelSerializer):
    """
    Serializer for celery task result
    """

    class Meta:
        model = TaskResult
        fields = ['id', 'task_id', 'status', 'result']
        read_only_fields = ['id', 'task_id', 'status', 'result']
