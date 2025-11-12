import { useThemeColor } from '@/hooks/use-theme-color'
import axios from 'axios'
import * as Location from 'expo-location'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'

const iconCooperativa = require('@/assets/imgs/icons/cooperativa.png')
const iconPonto = require('@/assets/imgs/icons/ecoponto.png')
const iconLocalizacao = require('@/assets/imgs/icons/local.png')

const icones = {
  cooperativa: iconCooperativa,
  ponto: iconPonto,
}

interface Local {
  id: number | string
  nome: string
  endereco: string
  latitude: number
  longitude: number
  tipo: 'cooperativa' | 'ponto'
}

export default function MapaScreen() {
  const fundo = useThemeColor({}, 'background')
  const texto = useThemeColor({}, 'text')
  const { latitude, longitude } = useLocalSearchParams()

  const [locais, setLocais] = useState<Local[]>([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    const carregarLocais = async () => {
      try {
        const BASE_URL = 'https://ecomap-api-013m.onrender.com/api'
        const [pontosRes, coopRes] = await Promise.all([
          axios.get(`${BASE_URL}/pontos-coleta/`),
          axios.get(`${BASE_URL}/cooperativas/`),
        ])

        const extrair = (res: any, tipo: 'cooperativa' | 'ponto') => {
          if (!res.data?.features) return []
          return res.data.features
            .filter((f: any) => Array.isArray(f.geometry?.coordinates))
            .map((f: any) => ({
              id: f.id || Math.random(),
              nome: f.properties?.nome || 'Sem nome',
              endereco: f.properties?.endereco || 'Sem endereço',
              latitude: Number(f.geometry.coordinates[1]),
              longitude: Number(f.geometry.coordinates[0]),
              tipo,
            }))
            .filter(
              (l: { latitude: number; longitude: number }) =>
                !isNaN(l.latitude) && !isNaN(l.longitude)
            )
        }

        const pontos = extrair(pontosRes, 'ponto')
        const cooperativas = extrair(coopRes, 'cooperativa')
        setLocais([...pontos, ...cooperativas])
      } catch (error) {
        console.error(error)
        Alert.alert('Erro', 'Não foi possível carregar os locais.')
      } finally {
        setLoading(false)
      }
    }

    carregarLocais()
  }, [])

  useEffect(() => {
    // Se latitude e longitude vierem da rota, centraliza o mapa nelas
    if (latitude && longitude && mapRef.current) {
      const lat = Number(latitude)
      const lon = Number(longitude)
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }, [latitude, longitude])

  const buscarMinhaLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar sua localização.')
      return
    }

    const local = await Location.getCurrentPositionAsync({})
    mapRef.current?.animateToRegion({
      latitude: local.coords.latitude,
      longitude: local.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={texto} />
        <Text style={[styles.loading, { color: texto }]}>Carregando locais...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: latitude ? Number(latitude) : -19.9208,
          longitude: longitude ? Number(longitude) : -43.9378,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {locais.map(local => (
          <Marker
            key={local.id}
            coordinate={{ latitude: local.latitude, longitude: local.longitude }}
            title={local.nome}
            description={local.endereco}
          >
            <Image
              source={icones[local.tipo]}
              style={styles.markerIcon}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Se veio ponto específico da rota, adiciona marcador especial */}
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude),
            }}
            title="Destino selecionado"
          >
            <Image
              source={require('@/assets/imgs/icons/destino.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: fundo }]}
        onPress={buscarMinhaLocalizacao}
      >
        <Image
          source={iconLocalizacao}
          style={{ width: 30, height: 30, tintColor: texto }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
