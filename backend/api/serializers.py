from django.contrib.gis.geos import Point
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

    def create(self, validated_data):
        tipos_residuos_data = validated_data.pop('tipos_residuos_aceitos', [])
        localizacao_data = validated_data.get('localizacao')

        # Se o campo veio como string (ex: "-46.625290, -23.533773")
        if isinstance(localizacao_data, str):
            try:
                lon, lat = map(float, localizacao_data.split(','))
                validated_data['localizacao'] = Point(lon, lat)
            except Exception:
                raise serializers.ValidationError(
                    "Formato inválido. Use 'longitude, latitude' (ex: -46.625290, -23.533773)"
                )

        ponto_coleta = PontoColeta.objects.create(**validated_data)
        ponto_coleta.tipos_residuos_aceitos.set(tipos_residuos_data)
        
        return ponto_coleta

# --- CORREÇÃO APLICADA AQUI ---
# 1. Mudei a classe base para 'GeoFeatureModelSerializer'
class CooperativaSerializer(GeoFeatureModelSerializer):
    tipos_residuos_aceitos = serializers.PrimaryKeyRelatedField(
        queryset=TipoResiduo.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Cooperativa
        geo_field = "localizacao" # 2. Adicionei o 'geo_field'
        fields = ['id', 'nome', 'responsavel', 'telefone', 'email', 'endereco', 'localizacao', 'tipos_residuos_aceitos']
    
    def create(self, validated_data):
        # 3. Remova APENAS o campo M2M
        tipos_residuos_data = validated_data.pop('tipos_residuos_aceitos', None)
        
        # 4. NÃO FAÇA O .pop() da 'localizacao'. Deixe ela em validated_data.
        cooperativa = Cooperativa.objects.create(**validated_data)

        if tipos_residuos_data is not None:
            cooperativa.tipos_residuos_aceitos.set(tipos_residuos_data)
        
        return cooperativa
