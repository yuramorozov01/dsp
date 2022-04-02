from correlation_app.models import SimpleCorrelationResult
from correlation_app.permissions import IsSimpleCorrelationResultAuthor
from correlation_app.serializers import (
    SimpleCorrelationResultCreateSerializer,
    SimpleCorrelationResultDetailsSerializer)
from correlation_app.tasks import CalcSimpleCorrelationTask
from rest_framework import mixins, permissions, viewsets


class SimpleCorrelationResultView(viewsets.GenericViewSet,
                                  mixins.CreateModelMixin,
                                  mixins.RetrieveModelMixin,
                                  mixins.ListModelMixin,
                                  mixins.DestroyModelMixin):
    """
    create:
        Create simple correlation result.
    retrieve:
        Get the specified simple correlation result.
    list:
        Get all simple correlation results by authenticated user.
    destroy:
        Delete the specified simple correlation result.
        Can be done only by an author of simple correlation result.
    """

    def get_queryset(self):
        querysets_dict = {
            'retrieve': SimpleCorrelationResult.objects.all(),
            'list': SimpleCorrelationResult.objects.filter(author=self.request.user.id),
            'destroy': SimpleCorrelationResult.objects.filter(author=self.request.user.id),
        }
        queryset = querysets_dict.get(self.action)
        return queryset.distinct()

    def get_serializer_class(self):
        serializers_dict = {
            'create': SimpleCorrelationResultCreateSerializer,
            'retrieve': SimpleCorrelationResultDetailsSerializer,
            'list': SimpleCorrelationResultDetailsSerializer,
        }
        serializer_class = serializers_dict.get(self.action)
        return serializer_class

    def get_permissions(self):
        base_permissions = []
        permissions_dict = {
            'create': [],
            'retrieve': [],
            'list': [permissions.IsAuthenticated],
            'destroy': [permissions.IsAuthenticated, IsSimpleCorrelationResultAuthor],
        }
        base_permissions += permissions_dict.get(self.action, [])
        return [permission() for permission in base_permissions]

    def perform_create(self, serializer):
        author = None if not hasattr(self.request, 'user') else self.request.user

        amplitudes_signal_1 = serializer.validated_data.get('amplitudes_signal_1')
        frequencies_signal_1 = serializer.validated_data.get('frequencies_signal_1')
        amount_of_points_signal_1 = serializer.validated_data.get('amount_of_points_signal_1')

        amplitudes_signal_2 = serializer.validated_data.get('amplitudes_signal_2')
        frequencies_signal_2 = serializer.validated_data.get('frequencies_signal_2')
        amount_of_points_signal_2 = serializer.validated_data.get('amount_of_points_signal_2')

        task = CalcSimpleCorrelationTask().apply_async(
            kwargs={
                'raw_amplitudes_signal_1': amplitudes_signal_1,
                'raw_frequencies_signal_1': frequencies_signal_1,
                'amount_of_points_signal_1': amount_of_points_signal_1,
                'raw_amplitudes_signal_2': amplitudes_signal_2,
                'raw_frequencies_signal_2': frequencies_signal_2,
                'amount_of_points_signal_2': amount_of_points_signal_2,
            }
        )
        serializer.save(author=author, task_id=task.id)
