from base_app.permissions import CustomBasePermission


class IsFourierTransformResultAuthor(CustomBasePermission):
    """
    Permission to only allow author of a fourier transform result to manipulate with it.
    Assumes the user model instance has an `fourier_transform_results` attribute.
    """

    message = 'Only author is allowed to do this.'

    def has_permission(self, request, view):
        return self.has_permission_by_field(request, view, 'fourier_transform_results', 'pk')
