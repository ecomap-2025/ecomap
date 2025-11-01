import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Interfaces para os dados da API
interface ApiPontoColeta {
  id: number;
  nome: string;
  endereco: string;
}

// Interfaces para os dados formatados para a tela
interface HighlightItem {
  id: string;
  title: string;
  image: string;
}

interface NearbyItem {
  id: string;
  title: string;
  category: string;
  distance: string;
}

// Pega as dimensões da tela uma vez para usar nos estilos
const { width, height } = Dimensions.get('window');

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  // Estados para guardar os dados da API e controlar o carregamento
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Efeito que busca os dados na API quando a tela abre
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      try {
        const response = await axios.get<ApiPontoColeta[]>('https://ecomap-api-013m.onrender.com/api/pontos-coleta/');
        const pontosDeColeta = response.data;

        // Simulação: Transforma os dados da API para o formato que a tela precisa
        const highlightsData = pontosDeColeta.slice(0, 3).map(ponto => ({
          id: String(ponto.id),
          title: ponto.nome,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AmtWnHFWNPj9eoa86FLKkapHDXwJGOaXMA&s',
        }));

        const nearbyData = pontosDeColeta.slice(3, 6).map(ponto => ({
          id: String(ponto.id),
          title: ponto.nome,
          category: 'Vários materiais',
          distance: `${(Math.random() * 4 + 1).toFixed(1)}km`,
        }));
        
        setHighlights(highlightsData);
        setNearbyPlaces(nearbyData);

      } catch (error) {
        console.error("Erro ao buscar dados para a tela inicial:", error);
      } finally {
        setLoading(false); // Para de carregar, independentemente de sucesso ou erro
      }
    };
    
    buscarDadosIniciais();
  }, []);

  // Tela de Carregamento
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fundo }}>
        <ActivityIndicator size="large" color={texto} />
        <Text style={{ color: texto, marginTop: 15, fontFamily: 'Poppins-Regular' }}>
          Carregando informações...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ backgroundColor: fundo, flex: 1 }} 
        contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}
    >
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.25, height: width * 0.25, resizeMode: 'contain' }} />
      </View>

      <View style={{ width: '100%', alignItems: 'center', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.07, fontFamily: 'Poppins-Bold', color: texto }}>Olá!</Text>
        <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: texto }}>Seja bem-vindo(a) ao EcoMap!</Text>
      </View>

      <TouchableOpacity 
          style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: 15, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, marginBottom: height * 0.03, flexDirection: 'row', alignItems: 'center' }} 
          onPress={() => router.push('/(tabs)/pesquisa')}
      >
        <Image source={require('@/assets/imgs/icons/search.png')} style={{ width: width * 0.05, height: width * 0.05, tintColor: '#888', marginRight: width * 0.03 }} />
        <Text style={{ fontFamily: 'Poppins-Regular', color: '#888', fontSize: width * 0.04 }}>Pesquisar por um local...</Text>
      </TouchableOpacity>

      {/* Seção Destaques */}
      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.06, fontFamily: 'Poppins-SemiBold', marginBottom: height * 0.02, color: texto }}>Destaques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {highlights.map(item => (
            <TouchableOpacity key={item.id} style={{ width: width * 0.4, marginRight: width * 0.04 }}>
              <Image source={{ uri: item.image }} style={{ width: '100%', height: width * 0.4, borderRadius: 15, marginBottom: height * 0.01 }} />
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: width * 0.035, color: texto }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Seção Perto de Você */}
      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.06, fontFamily: 'Poppins-SemiBold', marginBottom: height * 0.02, color: texto }}>Perto de Você</Text>
        {nearbyPlaces.map(item => (
          <TouchableOpacity key={item.id} style={{ backgroundColor: '#fff', borderRadius: 10, padding: width * 0.04, marginBottom: height * 0.015, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 }}>
            <View>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: width * 0.04, color: '#333' }}>{item.title}</Text>
              <Text style={{ fontFamily: 'Poppins-Regular', color: '#777', fontSize: width * 0.03 }}>{item.category} • {item.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}