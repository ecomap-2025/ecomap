import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://ecomap-api-013m.onrender.com/api';

type TipoCadastro = 'ponto' | 'cooperativa';

interface TipoResiduo {
  id: number;
  nome: string;
  reciclavel: boolean;
}

interface Coordenadas {
  latitude: number;
  longitude: number;
}

export default function CadastrarScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>('ponto');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [horario, setHorario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [tiposResiduosDisponiveis, setTiposResiduosDisponiveis] = useState<TipoResiduo[]>([]);
  const [residuosSelecionados, setResiduosSelecionados] = useState<number[]>([]);
  const [marcadorCoords, setMarcadorCoords] = useState<Coordenadas | null>(null);
  const [regiaoInicial, setRegiaoInicial] = useState({
    latitude: -19.8988,
    longitude: -44.0522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [permissaoLocalizacao, setPermissaoLocalizacao] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: fundo,
    },
    scrollContentContainer: {
      alignItems: 'center',
      paddingVertical: height * 0.05,
      paddingHorizontal: width * 0.05,
    },
    logo: {
      width: width * 0.25,
      height: width * 0.25,
      resizeMode: 'contain',
    },
    headerContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: height * 0.02,
      marginTop: height * 0.01,
    },
    title: {
      fontSize: width * 0.07,
      fontFamily: 'Poppins-Bold',
      marginBottom: 5,
      color: texto,
    },
    subtitle: {
      fontSize: width * 0.035,
      fontFamily: 'Poppins-Regular',
      color: texto,
    },
    tabContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: height * 0.04,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    tabButtonSelected: {
      backgroundColor: '#2a9d8f',
    },
    tabButtonText: {
      fontFamily: 'Poppins-SemiBold',
      color: '#555',
      fontSize: width * 0.035,
    },
    tabButtonTextSelected: {
      color: '#fff',
    },
    label: {
      width: '100%',
      fontFamily: 'Poppins-SemiBold',
      fontSize: width * 0.04,
      marginBottom: height * 0.01,
      color: texto,
    },
    input: {
      backgroundColor: '#f0f0f0',
      width: '100%',
      borderRadius: 10,
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.04,
      fontFamily: 'Poppins-Regular',
      fontSize: width * 0.04,
      color: '#333',
      marginBottom: height * 0.02,
    },
    residuosContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: height * 0.02,
    },
    residuoButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: '#e0e0e0',
      marginRight: 10,
      marginBottom: 10,
    },
    residuoButtonSelected: {
      backgroundColor: '#2a9d8f',
    },
    residuoButtonText: {
      fontFamily: 'Poppins-Regular',
      color: '#333',
    },
    residuoButtonTextSelected: {
      color: '#fff',
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#2a9d8f',
      borderRadius: 15,
      paddingVertical: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#2a9d8f',
      marginTop: height * 0.02,
    },
    submitButtonDisabled: {
      backgroundColor: '#a9a9a9',
    },
    submitButtonText: {
      fontFamily: 'Poppins-Bold',
      color: '#fff',
      fontSize: width * 0.045,
    },
    mapContainer: {
      width: '100%',
      height: height * 0.3,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: height * 0.02,
      backgroundColor: '#e0e0e0',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    mapLabel: {
      width: '100%',
      fontFamily: 'Poppins-Regular',
      fontSize: width * 0.035,
      color: texto,
      textAlign: 'center',
      marginBottom: height * 0.02,
    },
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Para centrar o mapa, precisamos da sua localização.');
        setPermissaoLocalizacao(false);
        return;
      }

      setPermissaoLocalizacao(true);

      try {
        let location = await Location.getCurrentPositionAsync({});
        setRegiaoInicial({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.warn('Erro ao pegar localização inicial:', error);
      }
    })();
  }, []);

  useEffect(() => {
    const buscarTiposDeResiduo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tipos-residuo/`);
        if (response.data && Array.isArray(response.data.features)) {
          const tipos = response.data.features.map((feature: any) => feature.properties);
          setTiposResiduosDisponiveis(tipos);
        } else if (response.data && Array.isArray(response.data.results)) {
          setTiposResiduosDisponiveis(response.data.results);
        } else if (Array.isArray(response.data)) {
          setTiposResiduosDisponiveis(response.data);
        } else {
          throw new Error('Formato de resposta inesperado.');
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de resíduo:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de tipos de resíduo.');
      }
    };
    buscarTiposDeResiduo();
  }, []);

  const handleToggleResiduo = (id: number) => {
    setResiduosSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(residuoId => residuoId !== id)
        : [...prev, id]
    );
  };

  const resetarFormulario = () => {
    setNome('');
    setEndereco('');
    setTelefone('');
    setEmail('');
    setHorario('');
    setResiduosSelecionados([]);
    setMarcadorCoords(null);
  };

  const handleCadastro = async () => {
    setEnviando(true);
    let url = '';
    let dadosParaApi: any = {};
    let nomeDoItem = '';

    const msgErroObrigatorios = 'Nome, Endereço e ao menos um Tipo de Resíduo são obrigatórios.';

    if (!nome || !endereco || residuosSelecionados.length === 0) {
      Alert.alert('Atenção', msgErroObrigatorios);
      setEnviando(false);
      return;
    }

    if (!marcadorCoords) {
      Alert.alert('Atenção', 'Por favor, marque o local exato no mapa.');
      setEnviando(false);
      return;
    }

    switch (tipoCadastro) {
      case 'ponto':
        url = `${API_BASE_URL}/pontos-coleta/`;
        dadosParaApi = {
          nome,
          endereco,
          telefone: telefone || null,
          email: email || null,
          horario_funcionamento: horario || null,
          tipos_residuos_aceitos: residuosSelecionados,
          latitude: marcadorCoords.latitude,
          longitude: marcadorCoords.longitude,
          localizacao: {
            type: 'Point',
            coordinates: [marcadorCoords.longitude, marcadorCoords.latitude],
          },
        };

        nomeDoItem = 'Ponto de Coleta';
        break;

      case 'cooperativa':
        url = `${API_BASE_URL}/cooperativas/`;
        dadosParaApi = {
          nome,
          endereco,
          telefone: telefone || null,
          email: email || null,
          horario_funcionamento: horario || null,
          tipos_residuos_aceitos: residuosSelecionados,
          latitude: marcadorCoords.latitude,
          longitude: marcadorCoords.longitude,
          localizacao: {
            type: 'Point',
            coordinates: [marcadorCoords.longitude, marcadorCoords.latitude],
          },
        };
        nomeDoItem = 'Cooperativa';
        break;
    }

    try {
      await axios.post(url, dadosParaApi);
      Alert.alert('Sucesso!', `${nomeDoItem} cadastrado(a) com sucesso.`);
      resetarFormulario();
      router.back();
    } catch (error) {
      let mensagemErro = 'Não foi possível cadastrar. Tente novamente.';
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro de API EcoMap:', JSON.stringify(error.response.data, null, 2));
        const detalhesErro = Object.values(error.response.data).flat().join('\n');
        if (detalhesErro) mensagemErro = `Erro: \n${detalhesErro}`;
      } else {
        console.error('Erro desconhecido:', error);
      }
      Alert.alert('Erro', mensagemErro);
    } finally {
      setEnviando(false);
    }
  };

  const BotaoSelecao = ({
    tipo,
    label,
  }: {
    tipo: TipoCadastro;
    label: string;
  }) => {
    const isSelected = tipoCadastro === tipo;
    return (
      <TouchableOpacity
        onPress={() => setTipoCadastro(tipo)}
        style={[styles.tabButton, isSelected && styles.tabButtonSelected]}
      >
        <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFormulario = () => {
    return (
      <>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder={tipoCadastro === 'ponto' ? 'Nome do Ecoponto' : 'Nome da Cooperativa'}
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Text style={styles.label}>Endereço*</Text>
        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, número, bairro e cidade"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Text style={styles.label}>Localização no Mapa*</Text>
        <Text style={styles.mapLabel}>(Toque no mapa para definir a localização exata)</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={regiaoInicial}
            onPress={e => setMarcadorCoords(e.nativeEvent.coordinate)}
            showsUserLocation={permissaoLocalizacao}
          >
            {marcadorCoords && <Marker coordinate={marcadorCoords} />}
          </MapView>
        </View>

        <Text style={styles.label}>Telefone (Opcional)</Text>
        <TextInput
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(31) 99999-9999"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>E-mail (Opcional)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="contato@exemplo.com"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Horário de Funcionamento (Opcional)</Text>
        <TextInput
          value={horario}
          onChangeText={setHorario}
          placeholder="Seg a Sex, 08:00 - 18:00"
          style={styles.input}
        />

        <Text style={styles.label}>Tipos de Resíduos Aceitos*</Text>
        <View style={styles.residuosContainer}>
          {tiposResiduosDisponiveis.map(residuo => {
            const isSelected = residuosSelecionados.includes(residuo.id);
            return (
              <TouchableOpacity
                key={residuo.id}
                onPress={() => handleToggleResiduo(residuo.id)}
                style={[styles.residuoButton, isSelected && styles.residuoButtonSelected]}
              >
                <Text style={[styles.residuoButtonText, isSelected && styles.residuoButtonTextSelected]}>
                  {residuo.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>CADASTRAR</Text>
        <Text style={styles.subtitle}>Selecione o que você deseja adicionar:</Text>
      </View>
      <View style={styles.tabContainer}>
        <BotaoSelecao tipo="ponto" label="Ponto de Coleta" />
        <BotaoSelecao tipo="cooperativa" label="Cooperativa" />
      </View>
      {renderFormulario()}
      <TouchableOpacity
        disabled={enviando}
        onPress={handleCadastro}
        style={[styles.submitButton, enviando && styles.submitButtonDisabled]}
      >
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Confirmar Cadastro</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
