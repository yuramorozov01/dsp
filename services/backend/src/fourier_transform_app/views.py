from fourier_transform_app.models import FourierTransformResult
from fourier_transform_app.permissions import IsFourierTransformResultAuthor
from fourier_transform_app.serializers import (
    FourierTransformResultCreateSerializer,
    FourierTransformResultDetailsSerializer)
from fourier_transform_app.tasks import CalcFourierTransformTask
from rest_framework import mixins, permissions, viewsets


class FourierTransformResultView(viewsets.GenericViewSet,
                                 mixins.CreateModelMixin,
                                 mixins.RetrieveModelMixin,
                                 mixins.ListModelMixin,
                                 mixins.DestroyModelMixin):
    """
    create:
        Create fourier transform result.
    retrieve:
        Get the specified fourier transform result.
    list:
        Get all fourier transform results by authenticated user.
    destroy:
        Delete the specified fourier transform result.
        Can be done only by an author of fourier transform result.
    """

    def get_queryset(self):
        querysets_dict = {
            'retrieve': FourierTransformResult.objects.all(),
            'list': FourierTransformResult.objects.filter(author=self.request.user.id),
            'destroy': FourierTransformResult.objects.filter(author=self.request.user.id),
        }
        queryset = querysets_dict.get(self.action)
        return queryset.distinct()

    def get_serializer_class(self):
        serializers_dict = {
            'create': FourierTransformResultCreateSerializer,
            'retrieve': FourierTransformResultDetailsSerializer,
            'list': FourierTransformResultDetailsSerializer,
        }
        serializer_class = serializers_dict.get(self.action)
        return serializer_class

    def get_permissions(self):
        base_permissions = []
        permissions_dict = {
            'create': [],
            'retrieve': [],
            'list': [permissions.IsAuthenticated],
            'destroy': [permissions.IsAuthenticated, IsFourierTransformResultAuthor],
        }
        base_permissions += permissions_dict.get(self.action, [])
        return [permission() for permission in base_permissions]

    def perform_create(self, serializer):
        author = None if not hasattr(self.request, 'user') else self.request.user
        amplitudes = serializer.validated_data.get('amplitudes')
        frequencies = serializer.validated_data.get('frequencies')
        task = CalcFourierTransformTask().apply_async(
            kwargs={
                'raw_amplitudes': amplitudes,
                'raw_frequencies': frequencies,
            }
        )
        serializer.save(author=author, task_id=task.id)
