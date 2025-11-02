import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { darkMapStyle } from '@/constants/mapStyle';

interface PontoProperties {
  id: number;
  nome: string;
  endereco: string;
}

interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

interface GeoJsonFeature {
  type: 'Feature';
  geometry: PointGeometry;
  properties: PontoProperties;
}

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');

  const [pontos, setPontos] = useState<GeoJsonFeature[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const buscarPontos = async () => {
      try {
        const response = await axios.get<{ type: string, features: GeoJsonFeature[] }>('https://ecomap-api-013m.onrender.com/api/pontos-coleta/');
        
        console.log('DADOS RECEBIDOS DA API:', JSON.stringify(response.data, null, 2));

        if (response.data && Array.isArray(response.data.features)) {
          setPontos(response.data.features);
        } else {
          console.warn("A resposta da API não continha a propriedade 'features' esperada.");
          setPontos([]);
        }

      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
        setPontos([]); 
      } finally {
        setLoading(false);
      }
    };
    buscarPontos();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fundo }}>
        <Text style={{ color: texto, fontFamily: 'Poppins-Regular', fontSize: 18 }}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -19.9224,
          longitude: -44.0583,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        // 4. APLICAÇÃO DO TEMA ESCURO (SEMPRE)
        userInterfaceStyle={"dark"} // Propriedade para Apple Maps (iOS)
        customMapStyle={darkMapStyle} // Propriedade para Google Maps (Android e iOS)
      >
        {/* O <UrlTile> foi removido para permitir o uso dos mapas nativos e seus estilos */}
        
        {pontos.map(ponto => {
          const [longitude, latitude] = ponto.geometry.coordinates;
          return (
            <Marker
              key={ponto.properties.id}
              coordinate={{ latitude, longitude }}
              // Opcional: Customizar o ícone do marcador para combinar com o mapa escuro
              // pinColor="indigo" 
            >
              <Callout>
                <View style={{ padding: 10, width: 220 }}>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#333' }}>
                    {ponto.properties.nome}
                  </Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', color: '#666' }}>
                    {ponto.properties.endereco}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}