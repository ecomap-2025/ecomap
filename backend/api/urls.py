from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tipos-residuo', views.TipoResiduoViewSet, basename='tiporesiduo')
router.register(r'pontos-coleta', views.PontoColetaViewSet, basename='pontocoleta')
router.register(r'cooperativas', views.CooperativaViewSet, basename='cooperativa')

urlpatterns = [
    path('', include(router.urls)),
]