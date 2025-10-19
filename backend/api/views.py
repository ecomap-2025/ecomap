from rest_framework import viewsets
from .models import TipoResiduo, PontoColeta, Cooperativa
from .serializers import TipoResiduoSerializer, PontoColetaSerializer, CooperativaSerializer

class TipoResiduoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoResiduo.objects.all()
    serializer_class = TipoResiduoSerializer

class PontoColetaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PontoColetaSerializer

    def get_queryset(self):
        queryset = PontoColeta.objects.all()
        residuo = self.request.query_params.get('residuo', None)  # Pega o parâmetro 'residuo' da URL, se ele existir.
        if residuo is not None:
            queryset = queryset.filter(tipos_residuos_aceitos__nome__icontains=residuo) # Filtra para incluir apenas pontos que aceitam o tipo de resíduo.
        return queryset

class CooperativaViewSet(viewsets.ModelViewSet):
    queryset = Cooperativa.objects.filter(status_cadastro='APROVADO') # Mostra apenas cooperativas aprovadas
    serializer_class = CooperativaSerializer
