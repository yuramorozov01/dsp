from correlation_app import views as correlation_views
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'simple_correlation',
    correlation_views.SimpleCorrelationResultView,
    basename='simple_correlation'
)

urlpatterns = [
    path(r'', include(router.urls)),
]
