from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import TipoResiduo, PontoColeta, Cooperativa

class TipoResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoResiduo
        fields = ['id', 'nome', 'descricao', 'reciclavel']

class PontoColetaSerializer(GeoFeatureModelSerializer):
    tipos_residuos_aceitos = serializers.PrimaryKeyRelatedField(
        queryset=TipoResiduo.objects.all(), 
        many=True
    )

    class Meta:
        model = PontoColeta
        geo_field = "localizacao"
        fields = ['id', 'nome', 'endereco', 'telefone', 'email', 'horario_funcionamento', 'localizacao', 'tipos_residuos_aceitos']

class CooperativaSerializer(serializers.ModelSerializer):
    tipos_residuos_aceitos = serializers.PrimaryKeyRelatedField(
        queryset=TipoResiduo.objects.all(),
        many=True,
        required=False # Adicionado para garantir que seja opcional, caso necessário
    )

    class Meta:
        model = Cooperativa
        fields = ['id', 'nome', 'responsavel', 'telefone', 'email', 'endereco', 'localizacao', 'tipos_residuos_aceitos']