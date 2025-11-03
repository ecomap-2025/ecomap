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

    # Sobrescrevemos o método create para lidar com os dados de localização e M2M.
    def create(self, validated_data):
        # 1. Separa os dados de relacionamento e localização
        tipos_residuos_data = validated_data.pop('tipos_residuos_aceitos')
        localizacao_data = validated_data.pop('localizacao')

        # 2. Cria o objeto PontoColeta com os dados simples
        ponto_coleta = PontoColeta.objects.create(**validated_data)

        # 3. Define a relação Muitos-para-Muitos
        ponto_coleta.tipos_residuos_aceitos.set(tipos_residuos_data)

        # 4. Cria o objeto Point e o atribui, se a localização foi enviada
        if localizacao_data:
            ponto_coleta.localizacao = Point(localizacao_data['coordinates'])
            ponto_coleta.save()

        return ponto_coleta

class CooperativaSerializer(serializers.ModelSerializer):
    tipos_residuos_aceitos = serializers.PrimaryKeyRelatedField(
        queryset=TipoResiduo.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Cooperativa
        fields = ['id', 'nome', 'responsavel', 'telefone', 'email', 'endereco', 'localizacao', 'tipos_residuos_aceitos']
    
    def create(self, validated_data):
        tipos_residuos_data = validated_data.pop('tipos_residuos_aceitos', None)
        localizacao_data = validated_data.pop('localizacao', None)

        cooperativa = Cooperativa.objects.create(**validated_data)

        if tipos_residuos_data is not None:
            cooperativa.tipos_residuos_aceitos.set(tipos_residuos_data)
        
        if localizacao_data:
            cooperativa.localizacao = Point(localizacao_data['coordinates'])
            cooperativa.save()

        return cooperativa