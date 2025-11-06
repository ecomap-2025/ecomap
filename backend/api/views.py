from rest_framework import viewsets
from .models import TipoResiduo, PontoColeta, Cooperativa
from .serializers import TipoResiduoSerializer, PontoColetaSerializer, CooperativaSerializer

class TipoResiduoViewSet(viewsets.ModelViewSet):
    queryset = TipoResiduo.objects.all()
    serializer_class = TipoResiduoSerializer

class PontoColetaViewSet(viewsets.ModelViewSet):
    serializer_class = PontoColetaSerializer

    def get_queryset(self):
        queryset = PontoColeta.objects.all()
        residuo = self.request.query_params.get('residuo', None)
        if residuo is not None:
            queryset = queryset.filter(tipos_residuos_aceitos__nome__icontains=residuo)
        return queryset

class CooperativaViewSet(viewsets.ModelViewSet):
    queryset = Cooperativa.objects.filter(status_cadastro='APROVADO')
    serializer_class = CooperativaSerializer