import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';

// PASSO 1: Definir a estrutura (Interface) dos seus dados
// Esta é a "planta" do objeto que sua API retorna.
interface PontoProperties {
  id: number;
  nome: string;
  endereco: string;
  // Adicione outros campos se precisar usá-los no Callout
}

interface PointGeometry {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

interface GeoJsonFeature {
  type: 'Feature';
  geometry: PointGeometry;
  properties: PontoProperties;
}


export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');

  // PASSO 2: Aplicar a Interface ao useState
  // A sintaxe <GeoJsonFeature[]> diz: "Este estado será um array de objetos GeoJsonFeature"
  const [pontos, setPontos] = useState<GeoJsonFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPontos = async () => {
      try {
        // A resposta do axios já vem com um tipo genérico, então os dados se encaixam
        const response = await axios.get<{ features: GeoJsonFeature[] }>('https://ecomap-j557.onrender.com/api/pontos-coleta/');
        setPontos(response.data.features);
      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
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
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        
        {pontos.map(ponto => {
          // Agora o TypeScript sabe que 'ponto' tem 'geometry' e 'properties'!
          const [longitude, latitude] = ponto.geometry.coordinates;
          return (
            <Marker
              key={ponto.properties.id}
              coordinate={{ latitude, longitude }}
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