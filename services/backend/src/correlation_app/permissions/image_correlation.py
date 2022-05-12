from base_app.permissions import CustomBasePermission


class IsImageCorrelationResultAuthor(CustomBasePermission):
    """
    Permission to only allow author of a image correlation result to manipulate with it.
    Assumes the user model instance has an `image_correlation_results` attribute.
    """

    message = 'Only author is allowed to do this.'

    def has_permission(self, request, view):
        return self.has_permission_by_field(request, view, 'image_correlation_results', 'pk')
