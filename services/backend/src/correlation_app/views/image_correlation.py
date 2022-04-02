from celery import uuid
from correlation_app.models import ImageCorrelationResult
from correlation_app.permissions import IsImageCorrelationResultAuthor
from correlation_app.serializers import (
    ImageCorrelationResultCreateSerializer,
    ImageCorrelationResultDetailsSerializer)
from correlation_app.tasks import CalcImageCorrelationTask
from rest_framework import mixins, permissions, viewsets


class ImageCorrelationResultView(viewsets.GenericViewSet,
                                 mixins.CreateModelMixin,
                                 mixins.RetrieveModelMixin,
                                 mixins.ListModelMixin,
                                 mixins.DestroyModelMixin):
    """
    create:
        Create image correlation result.
    retrieve:
        Get the specified image correlation result.
    list:
        Get all image correlation results by authenticated user.
    destroy:
        Delete the specified image correlation result.
        Can be done only by an author of image correlation result.
    """

    def get_queryset(self):
        querysets_dict = {
            'retrieve': ImageCorrelationResult.objects.all(),
            'list': ImageCorrelationResult.objects.filter(author=self.request.user.id),
            'destroy': ImageCorrelationResult.objects.filter(author=self.request.user.id),
        }
        queryset = querysets_dict.get(self.action)
        return queryset.distinct()

    def get_serializer_class(self):
        serializers_dict = {
            'create': ImageCorrelationResultCreateSerializer,
            'retrieve': ImageCorrelationResultDetailsSerializer,
            'list': ImageCorrelationResultDetailsSerializer,
        }
        serializer_class = serializers_dict.get(self.action)
        return serializer_class

    def get_permissions(self):
        base_permissions = []
        permissions_dict = {
            'create': [],
            'retrieve': [],
            'list': [permissions.IsAuthenticated],
            'destroy': [permissions.IsAuthenticated, IsImageCorrelationResultAuthor],
        }
        base_permissions += permissions_dict.get(self.action, [])
        return [permission() for permission in base_permissions]

    def perform_create(self, serializer):
        author = None if not hasattr(self.request, 'user') else self.request.user
        task_id = uuid()
        image_correlation_result_model = serializer.save(author=author, task_id=task_id)
        CalcImageCorrelationTask().apply_async(
            kwargs={
                'image_1_path': image_correlation_result_model.image_1.path,
                'image_2_path': image_correlation_result_model.image_2.path,
                'task_id': task_id,
            },
            task_id=task_id
        )
