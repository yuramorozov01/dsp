from django.urls import include, path
from fourier_transform_app import views as fourier_transform_views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'fourier_transform',
    fourier_transform_views.FourierTransformResultView,
    basename='fourier_transform'
)

urlpatterns = [
    path(r'', include(router.urls)),
]
