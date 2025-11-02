import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ApiPontoColeta {
  id: number;
  nome: string;
  endereco: string;
  distancia?: number; 
}

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

const { width, height } = Dimensions.get('window');

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inicializarTela = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Necessária',
            'Para encontrar locais próximos, por favor, habilite o serviço de localização.'
          );
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await axios.get<ApiPontoColeta[]>(
          `https://ecomap-api-013m.onrender.com/api/pontos-coleta/?lat=${latitude}&lon=${longitude}`
        );
        const pontosDeColeta = response.data;

        if (!Array.isArray(pontosDeColeta)) {
            console.error("A resposta da API não é um array:", pontosDeColeta);
            throw new Error("Formato de dados inesperado da API.");
        }

        const highlightsData = pontosDeColeta.slice(0, 3).map(ponto => ({
          id: String(ponto.id),
          title: ponto.nome,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AmtWnHFWNPj9eoa86FLKkapHDXwJGOaXMA&s',
        }));

        const nearbyData = pontosDeColeta.slice(0, 6).map(ponto => ({
          id: String(ponto.id),
          title: ponto.nome,
          category: 'Vários materiais',
          distance: ponto.distancia ? `${ponto.distancia.toFixed(1)}km` : '...',
        }));
        
        setHighlights(highlightsData);
        setNearbyPlaces(nearbyData);

      } catch (error) {
        console.error("Erro ao inicializar a tela:", error);
        Alert.alert("Erro de Conexão", "Não foi possível carregar os dados. Verifique sua internet e tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    inicializarTela();
  }, []); 

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: fundo }]}>
        <ActivityIndicator size="large" color={texto} />
        <Text style={[styles.loadingText, { color: texto }]}>
          Carregando informações...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ backgroundColor: fundo }} 
        contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={[styles.title, { color: texto }]}>Olá!</Text>
        <Text style={[styles.subtitle, { color: texto }]}>Seja bem-vindo(a) ao EcoMap!</Text>
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/pesquisa')}>
        <Image source={require('@/assets/imgs/icons/search.png')} style={styles.searchIcon} />
        <Text style={styles.searchText}>Pesquisar por um local...</Text>
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: texto }]}>Destaques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {highlights.map(item => (
            <TouchableOpacity key={item.id} style={styles.highlightCard}>
              <Image source={{ uri: item.image }} style={styles.highlightImage} />
              <Text style={[styles.highlightTitle, { color: texto }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: texto }]}>Perto de Você</Text>
        {nearbyPlaces.map(item => (
          <TouchableOpacity key={item.id} style={styles.nearbyCard}>
            <View>
              <Text style={styles.nearbyTitle}>{item.title}</Text>
              <Text style={styles.nearbyInfo}>{item.category} • {item.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontFamily: 'Poppins-Regular' },
  scrollContainer: { alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 },
  logoContainer: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  logo: { width: width * 0.25, height: width * 0.25, resizeMode: 'contain' },
  welcomeContainer: { width: '100%', alignItems: 'center', marginBottom: height * 0.03 },
  title: { fontSize: width * 0.07, fontFamily: 'Poppins-Bold' },
  subtitle: { fontSize: width * 0.04, fontFamily: 'Poppins-Regular' },
  searchBar: { width: '100%', backgroundColor: '#f0f0f0', borderRadius: 15, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, marginBottom: height * 0.03, flexDirection: 'row', alignItems: 'center' },
  searchIcon: { width: width * 0.05, height: width * 0.05, tintColor: '#888', marginRight: width * 0.03 },
  searchText: { fontFamily: 'Poppins-Regular', color: '#888', fontSize: width * 0.04 },
  sectionContainer: { width: '100%', marginBottom: height * 0.03 },
  sectionTitle: { fontSize: width * 0.06, fontFamily: 'Poppins-SemiBold', marginBottom: height * 0.02 },
  highlightCard: { width: width * 0.4, marginRight: width * 0.04 },
  highlightImage: { width: '100%', height: width * 0.4, borderRadius: 15, marginBottom: height * 0.01 },
  highlightTitle: { fontFamily: 'Poppins-SemiBold', fontSize: width * 0.035 },
  nearbyCard: { backgroundColor: '#fff', borderRadius: 10, padding: width * 0.04, marginBottom: height * 0.015, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  nearbyTitle: { fontFamily: 'Poppins-SemiBold', fontSize: width * 0.04, color: '#333' },
  nearbyInfo: { fontFamily: 'Poppins-Regular', color: '#777', fontSize: width * 0.03 },
});