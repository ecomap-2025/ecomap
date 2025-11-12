import { useThemeColor } from '@/hooks/use-theme-color'
import axios from 'axios'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const { width, height } = Dimensions.get('window')

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background')
  const texto = useThemeColor({}, 'text')
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        // Testa conexão só para garantir feedback
        await axios.get('https://ecomap-api-013m.onrender.com/api/pontos-coleta/')
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: fundo }]}>
        <ActivityIndicator size="large" color={texto} />
        <Text style={[styles.loadingText, { color: texto }]}>Carregando informações...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.scrollView, { backgroundColor: fundo }]}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      </View>

      {/* Boas-vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.title, { color: texto }]}>Olá!</Text>
        <Text style={[styles.subtitle, { color: texto }]}>
          Pequenas ações transformam o planeta. Descubra onde reciclar e faça parte da mudança!
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/imgs/coleta.jpg')}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <Text style={styles.imageCaption}>
          Reciclar é cuidar do futuro — o seu e o do mundo.
        </Text>
      </View>

      {/* Botão principal */}
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/pesquisa')}
      >
        <Text style={styles.actionButtonText}>Começar a Reciclar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 15,
    fontFamily: 'Poppins-Regular'
  },
  scrollView: {
    flex: 1
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.06,
    paddingHorizontal: width * 0.07
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: height * 0.03
  },
  title: {
    fontSize: width * 0.075,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: '100%',
    opacity: 0.8
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: height * 0.03
  },
  mainImage: {
    width: width * 0.8,
    height: height * 0.3
  },
  imageCaption: {
    marginTop: 15,
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: '#4e4e4e',
    textAlign: 'center',
    maxWidth: '80%'
  },
  actionButton: {
    backgroundColor: '#2a6f4e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: height * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center'
  }
})
