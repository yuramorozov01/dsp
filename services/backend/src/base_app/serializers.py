from celery.result import AsyncResult
from django.contrib.auth import get_user_model
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for an user
    """

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']
