from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import TipoResiduo, PontoColeta, Cooperativa

class TipoResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoResiduo
        fields = ['id', 'nome', 'descricao', 'reciclavel']

class PontoColetaSerializer(GeoFeatureModelSerializer):
   tipos_residuos_aceitos = serializers.StringRelatedField(many=True)

   class Meta:
       model = PontoColeta
       geo_field = "localizacao"  # Informa qual campo contém as coordenadas geográficas.
       fields = ['id', 'nome', 'endereco', 'telefone', 'email', 'horario_funcionamento', 'tipos_residuos_aceitos']

class CooperativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cooperativa
        fields = ['id', 'nome', 'responsavel', 'telefone', 'email', 'endereco', 'localizacao']

   