from django.urls import include, path
from harmonic_signal_app import views as harmonic_signal_views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'harmonic_signal',
    harmonic_signal_views.HarmonicSignalResultView,
    basename='harmonic_signal'
)

urlpatterns = [
    path(r'', include(router.urls)),
]
