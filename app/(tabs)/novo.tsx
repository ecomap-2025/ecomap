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

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://ecomap-api-013m.onrender.com/api';

type TipoCadastro = 'ponto' | 'cooperativa';

interface TipoResiduo {
  id: number;
  nome: string;
  reciclavel: boolean;
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
  const [tiposResiduosDisponiveis, setTiposResiduosDisponiveis] = useState<
    TipoResiduo[]
  >([]);
  const [residuosSelecionados, setResiduosSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const buscarTiposDeResiduo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tipos-residuo/`);
        setTiposResiduosDisponiveis(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de resíduo:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar a lista de tipos de resíduo.'
        );
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
  };

const handleCadastro = async () => {
    setEnviando(true);
    let url = '';
    let dadosParaApi: any = {};
    let nomeDoItem = '';

    const msgErroObrigatorios =
      'Nome, Endereço e ao menos um Tipo de Resíduo são obrigatórios.';

    // PASSO 1: Validar campos (como antes)
    if (!nome || !endereco || residuosSelecionados.length === 0) {
      Alert.alert('Atenção', msgErroObrigatorios);
      setEnviando(false);
      return;
    }

    // --- NOVO PASSO 2: Converter Endereço em Coordenadas ---
    let localizacaoParaApi;
    try {
      // Isso transforma o texto do endereço (ex: "Rua X, 123") em [latitude, longitude]
      const geocodedLocations = await Location.geocodeAsync(endereco);

      if (!geocodedLocations || geocodedLocations.length === 0) {
        Alert.alert(
          'Endereço Inválido',
          'Não foi possível encontrar as coordenadas para este endereço. Verifique o endereço e tente novamente.'
        );
        setEnviando(false);
        return;
      }

      // Pegamos o primeiro resultado
      const { latitude, longitude } = geocodedLocations[0];

      // Criamos o objeto GeoJSON que a API espera
      // IMPORTANTE: O padrão GeoJSON é [longitude, latitude]
      localizacaoParaApi = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    } catch (e) {
      console.error('Erro ao geocodificar endereço:', e);
      Alert.alert(
        'Erro de Localização',
        'Houve um problema ao processar o endereço. Verifique sua conexão ou tente novamente.'
      );
      setEnviando(false);
      return;
    }
    // --- FIM DO NOVO PASSO ---

    // PASSO 3: Montar os dados (agora incluindo a 'localizacao')
    switch (tipoCadastro) {
      case 'ponto':
        url = `${API_BASE_URL}/pontos-coleta/`;
        dadosParaApi = {
          nome,
          endereco,
          telefone,
          email,
          horario_funcionamento: horario,
          tipos_residuos_aceitos: residuosSelecionados,
          localizacao: localizacaoParaApi, // <-- Adicionado de volta
        };
        nomeDoItem = 'Ponto de Coleta';
        break;

      case 'cooperativa':
        url = `${API_BASE_URL}/cooperativas/`;
        dadosParaApi = {
          nome,
          endereco,
          telefone,
          email,
          horario_funcionamento: horario,
          tipos_residuos_aceitos: residuosSelecionados,
          localizacao: localizacaoParaApi, // <-- Adicionado de volta
        };
        nomeDoItem = 'Cooperativa';
        break;
    }

    // PASSO 4: Enviar para a API (continua igual)
    try {
      await axios.post(url, dadosParaApi);
      Alert.alert('Sucesso!', `${nomeDoItem} cadastrado(a) com sucesso.`);
      resetarFormulario();
      router.back();
    } catch (error) {
      let mensagemErro = `Não foi possível cadastrar. Tente novamente.`;
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          'Erro de API:',
          JSON.stringify(error.response.data, null, 2)
        );
        // O erro "localizacao required" não deve mais acontecer
        // Mas se acontecer, o log abaixo mostrará
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
        <Text
          style={[
            styles.tabButtonText,
            isSelected && styles.tabButtonTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFormulario = () => {
    return (
      <>
        <Text style={[styles.label, { color: texto }]}>Nome*</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder={
            tipoCadastro === 'ponto'
              ? 'Nome do Ecoponto'
              : 'Nome da Cooperativa'
          }
          placeholderTextColor="#888"
          style={styles.input}
        />

        {/* --- CORREÇÃO APLICADA AQUI --- */}
        <Text style={[styles.label, { color: texto }]}>Endereço*</Text>
        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, número, bairro e cidade"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Text style={[styles.label, { color: texto }]}>Telefone (Opcional)</Text>
        <TextInput
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(31) 99999-9999"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={[styles.label, { color: texto }]}>E-mail (Opcional)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="contato@exemplo.com"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={[styles.label, { color: texto }]}>
          Horário de Funcionamento (Opcional)
        </Text>
        <TextInput
          value={horario}
          onChangeText={setHorario}
          placeholder="Seg a Sex, 08:00 - 18:00"
          style={styles.input}
        />

        <Text style={[styles.label, { color: texto }]}>
          Tipos de Resíduos Aceitos*
        </Text>
        <View style={styles.residuosContainer}>
          {tiposResiduosDisponiveis.map(residuo => {
            const isSelected = residuosSelecionados.includes(residuo.id);
            return (
              <TouchableOpacity
                key={residuo.id}
                onPress={() => handleToggleResiduo(residuo.id)}
                style={[
                  styles.residuoButton,
                  isSelected && styles.residuoButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.residuoButtonText,
                    isSelected && styles.residuoButtonTextSelected,
                  ]}
                >
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
      style={[styles.container, { backgroundColor: fundo }]}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />

      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: texto }]}>CADASTRAR</Text>
        <Text style={[styles.subtitle, { color: texto }]}>
          Selecione o que você deseja adicionar:
        </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContentContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  logo: { width: width * 0.25, height: width * 0.25, resizeMode: 'contain' },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  title: { fontSize: width * 0.07, fontFamily: 'Poppins-Bold', marginBottom: 5 },
  subtitle: { fontSize: width * 0.035, fontFamily: 'Poppins-Regular' },
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
  tabButtonSelected: { backgroundColor: '#2a9d8f' },
  tabButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
    fontSize: width * 0.035,
  },
  tabButtonTextSelected: { color: '#fff' },
  label: {
    width: '100%',
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
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
  residuoButtonSelected: { backgroundColor: '#2a9d8f' },
  residuoButtonText: { fontFamily: 'Poppins-Regular', color: '#333' },
  residuoButtonTextSelected: { color: '#fff' },
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
  submitButtonDisabled: { backgroundColor: '#a9a9a9' },
  submitButtonText: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontSize: width * 0.045,
  },
});