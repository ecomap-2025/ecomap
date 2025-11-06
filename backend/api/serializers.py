# api/serializers.py

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.gis.geos import Point
from .models import TipoResiduo, PontoColeta, Cooperativa

class TipoResiduoSerializer(serializers.ModelSerializer):
    """
    Serializer simples para listar os tipos de resíduos (apenas leitura).
    """
    class Meta:
        model = TipoResiduo
        fields = ['id', 'nome', 'descricao', 'reciclavel']

class PontoColetaSerializer(GeoFeatureModelSerializer):
    """
    Serializer avançado para Pontos de Coleta.
    Lê como GeoJSON, mas escreve (cria) a partir de campos simples.
    """
    # --- Campos de Leitura ---
    tipos_residuos_aceitos = serializers.StringRelatedField(many=True, read_only=True)

    # --- Campos de Escrita (para o frontend enviar no POST) ---
    latitude = serializers.FloatField(write_only=True, required=True)
    longitude = serializers.FloatField(write_only=True, required=True)
    tipos_residuos_aceitos_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, default=[]
    )

    class Meta:
        model = PontoColeta
        geo_field = "localizacao"
        fields = [
            'id', 'nome', 'endereco', 'telefone', 'email',
            'horario_funcionamento', 'tipos_residuos_aceitos',
            # --- CORREÇÃO AQUI ---
            # Adiciona os campos de escrita à lista de campos:
            'latitude', 'longitude', 'tipos_residuos_aceitos_ids'
        ]
        read_only_fields = ['id', 'tipos_residuos_aceitos']

    def create(self, validated_data):
        lat = validated_data.pop('latitude')
        lon = validated_data.pop('longitude')
        residuos_ids = validated_data.pop('tipos_residuos_aceitos_ids', [])
        localizacao_point = Point(lon, lat, srid=4326)
        ponto = PontoColeta.objects.create(
            localizacao=localizacao_point,
            **validated_data
        )
        if residuos_ids:
            ponto.tipos_residuos_aceitos.set(residuos_ids)
        return ponto

class CooperativaSerializer(GeoFeatureModelSerializer):
    """
    Serializer avançado para Cooperativas.
    Aceita 'latitude' e 'longitude' no POST.
    """
    # --- Campos de Escrita ---
    latitude = serializers.FloatField(write_only=True, required=True)
    longitude = serializers.FloatField(write_only=True, required=True)

    class Meta:
        model = Cooperativa
        geo_field = "localizacao"
        fields = [
            'id', 'nome', 'responsavel', 'telefone', 'email', 'endereco',
            'status_cadastro',
            # --- CORREÇÃO AQUI ---
            # Adiciona os campos de escrita à lista de campos:
            'latitude', 'longitude'
        ]
        read_only_fields = ['id', 'status_cadastro']

    def create(self, validated_data):
        lat = validated_data.pop('latitude')
        lon = validated_data.pop('longitude')
        localizacao_point = Point(lon, lat, srid=4326)
        cooperativa = Cooperativa.objects.create(
            localizacao=localizacao_point,
            **validated_data
        )
        return cooperativa