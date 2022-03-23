from django_celery_results.models import TaskResult
from harmonic_signal_app.models import HarmonicSignalResult
from harmonic_signal_app.serializers import (HarmonicSignalResultCreateSerializer,
                                             HarmonicSignalResultDetailsSerializer)
from harmonic_signal_app.permissions import IsHarmonicSignalResultAuthor
from harmonic_signal_app.tasks import CalcHarmonicSignalTask
from rest_framework import permissions, validators, viewsets, mixins
from rest_framework.decorators import action


class HarmonicSignalResultView(viewsets.GenericViewSet,
                               mixins.CreateModelMixin,
                               mixins.RetrieveModelMixin,
                               mixins.ListModelMixin,
                               mixins.DestroyModelMixin):
    """
    create:
        Create harmonic signal result.
    retrieve:
        Get the specified harmonic signal result.
    list:
        Get all harmonic signal results by authenticated user.
    destroy:
        Delete the specified harmonic signal result.
        Can be done only by an author of harmonic signal result.
    """

    def get_queryset(self):
        querysets_dict = {
            'retrieve': HarmonicSignalResult.objects.all(),
            'list': HarmonicSignalResult.objects.filter(author=self.request.user.id),
            'destroy': HarmonicSignalResult.objects.filter(author=self.request.user.id),
        }
        queryset = querysets_dict.get(self.action)
        return queryset.distinct()

    def get_serializer_class(self):
        serializers_dict = {
            'create': HarmonicSignalResultCreateSerializer,
            'retrieve': HarmonicSignalResultDetailsSerializer,
            'list': HarmonicSignalResultDetailsSerializer,
        }
        serializer_class = serializers_dict.get(self.action)
        return serializer_class

    def get_permissions(self):
        base_permissions = []
        permissions_dict = {
            'create': [],
            'retrieve': [],
            'list': [permissions.IsAuthenticated],
            'destroy': [permissions.IsAuthenticated, IsHarmonicSignalResultAuthor],
        }
        base_permissions += permissions_dict.get(self.action, [])
        return [permission() for permission in base_permissions]

    def perform_create(self, serializer):
        author = None if hasattr(self.request, 'user') else self.request.user
        amplitude = serializer.validated_data.get('amplitude')
        frequency = serializer.validated_data.get('frequency')
        initial_phase = serializer.validated_data.get('initial_phase')
        task = CalcHarmonicSignalTask().apply_async(
            args=[
                amplitude,
                frequency,
                initial_phase
            ]
        )
        serializer.save(author=author, celery_result=TaskResult.objects.filter(task_id=task.id).first())
