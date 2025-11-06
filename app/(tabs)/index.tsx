import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
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
}

const { width, height } = Dimensions.get('window');

function shuffleArray(array: any[]) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: fundo,
    },
    loadingText: {
      marginTop: 15,
      fontFamily: 'Poppins-Regular',
      color: texto,
    },
    scrollView: {
      backgroundColor: fundo,
    },
    scrollContainer: {
      alignItems: 'center',
      paddingVertical: height * 0.05,
      paddingHorizontal: width * 0.05,
    },
    logoContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: width * 0.25,
      height: width * 0.25,
      resizeMode: 'contain',
    },
    welcomeContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: height * 0.03,
    },
    title: {
      fontSize: width * 0.07,
      fontFamily: 'Poppins-Bold',
      color: texto,
    },
    subtitle: {
      textAlign:'center',
      alignItems:'center',
      fontSize: width * 0.04,
      fontFamily: 'Poppins-Regular',
      color: texto,
    },
    searchBar: {
      width: '100%',
      backgroundColor: '#f0f0f0',
      borderRadius: 15,
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.04,
      marginBottom: height * 0.03,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      width: width * 0.05,
      height: width * 0.05,
      tintColor: '#888',
      marginRight: width * 0.03,
    },
    searchText: {
      fontFamily: 'Poppins-Regular',
      color: '#888',
      fontSize: width * 0.04,
    },
    sectionContainer: {
      width: '100%',
      marginBottom: height * 0.03,
    },
    sectionTitle: {
      fontSize: width * 0.06,
      fontFamily: 'Poppins-SemiBold',
      marginBottom: height * 0.02,
      color: texto,
    },
    highlightCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: width * 0.04,
      marginBottom: height * 0.015,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
    },
    highlightTitle: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: width * 0.04,
      color: '#333',
    },
  });

  useEffect(() => {
    const inicializarTela = async () => {
      try {
        const BASE_URL = 'https://ecomap-api-013m.onrender.com/api';
        const pontosUrl = `${BASE_URL}/pontos-coleta/`;
        const cooperativasUrl = `${BASE_URL}/cooperativas/`;

        const [pontosResult, cooperativasResult] = await Promise.allSettled([
          axios.get(pontosUrl),
          axios.get(cooperativasUrl)
        ]);

        const extractFeatures = (result: PromiseSettledResult<any>): ApiPontoColeta[] => {
          if (result.status === 'rejected') {
            console.error("Erro ao buscar dados:", result.reason?.message);
            return [];
          }
          const responseData = result.value.data;
          if (typeof responseData === 'object' && responseData !== null && Array.isArray(responseData.features)) {
            return responseData.features.map((feature: any) => feature.properties);
          }
          console.error("A resposta da API não é um FeatureCollection válido:", responseData);
          return [];
        };

        const pontosDeColeta = extractFeatures(pontosResult);
        const cooperativas = extractFeatures(cooperativasResult);
        let todosOsLocais = [...pontosDeColeta, ...cooperativas];
        todosOsLocais = shuffleArray(todosOsLocais);

        const highlightsData = todosOsLocais.slice(0, 8).map(ponto => ({
          id: String(ponto.id),
          title: ponto.nome,
        }));

        setHighlights(highlightsData);

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={texto} />
        <Text style={styles.loadingText}>
          Carregando informações...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Olá!</Text>
        <Text style={styles.subtitle}>Encontre os pontos de coleta mais próximos e faça sua parte na sustentabilidade.</Text>
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/pesquisa')}>
        <Image source={require('@/assets/imgs/icons/search.png')} style={styles.searchIcon} />
        <Text style={styles.searchText}>Pesquisar por um local...</Text>
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Destaques</Text>

        {highlights.map(item => (
          <TouchableOpacity key={item.id} style={styles.highlightCard}>
            <View>
              <Text style={styles.highlightTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}