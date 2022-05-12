from base_app.permissions import CustomBasePermission


class IsSimpleCorrelationResultAuthor(CustomBasePermission):
    """
    Permission to only allow author of a simple correlation result to manipulate with it.
    Assumes the user model instance has an `simple_correlation_results` attribute.
    """

    message = 'Only author is allowed to do this.'

    def has_permission(self, request, view):
        return self.has_permission_by_field(request, view, 'simple_correlation_results', 'pk')
