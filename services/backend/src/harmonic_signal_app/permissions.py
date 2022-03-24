from base_app.permissions import CustomBasePermission


class IsHarmonicSignalResultAuthor(CustomBasePermission):
    """
    Permission to only allow author of a harmonic signal result to manipulate with it.
    Assumes the user model instance has an `harmonic_signal_results` attribute.
    """

    message = 'Only author is allowed to do this.'

    def has_permission(self, request, view):
        return self.has_permission_by_field(request, view, 'harmonic_signal_results', 'pk')
