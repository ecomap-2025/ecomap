import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import { useEffect, useState } from 'react';
// <-- MUDANÇA: Importar Alert
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://ecomap-api-013m.onrender.com/api';



interface ApiTipoResiduo {
  id: number;
  nome: string;
}

interface ApiPontoColeta {
  id: number;
  nome: string;
  tipos_residuo: ApiTipoResiduo[];
}

interface ApiCooperativa {
  id: number;
  nome: string;
  tipos_residuo: ApiTipoResiduo[];
}

interface Ponto {
  id: string; 
  nome: string;
  tipos: string[];
  origem: 'ponto' | 'cooperativa';
}


function PesquisaInput({ onSearch }: { onSearch: (searchText: string) => void; }) {
  const [query, setQuery] = useState('');
  const [tiposResiduosDisponiveis, setTiposResiduosDisponiveis] = useState<ApiTipoResiduo[]>([]);
  
  const handleChange = (text: string) => {
    setQuery(text);
  };
  const handleSearch = () => {
    onSearch(query);
  };

  useEffect(() => {
    const buscarTiposDeResiduo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tipos-residuo/`);
            setTiposResiduosDisponiveis(response.data);
        } catch (error) {
            console.error("Erro ao buscar tipos de resíduo:", error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de tipos de resíduo.');
        }
    };

    buscarTiposDeResiduo();
}, []);

  return (
    <View style={{ width: '100%', marginBottom: height * 0.03 }}>
      <View style={{width: '100%', backgroundColor: '#f0f0f0', borderRadius: 15, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Image
            source={require('@/assets/imgs/icons/search.png')}
            style={{ width: width * 0.05, height: width * 0.05, tintColor: '#888', marginRight: width * 0.03 }}
        />
        <TextInput
          style={{ flex: 1, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', paddingVertical: 0 }}
          placeholder="Pesquisar por nome, resíduo..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleChange}
          onSubmitEditing={handleSearch} 
          returnKeyType="search" 
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={{ color: '#232323', fontFamily: 'Poppins-SemiBold' }}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Tela Principal ---

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  
  const [carregando, setCarregando] = useState(true);
  const [todosOsPontos, setTodosOsPontos] = useState<Ponto[]>([]); 
  const [pontosFiltrados, setPontosFiltrados] = useState<Ponto[]>([]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [responsePontos, responseCoops] = await Promise.all([
          axios.get<ApiPontoColeta[]>(`${API_BASE_URL}/pontos-coleta/`),
          axios.get<ApiCooperativa[]>(`${API_BASE_URL}/cooperativas/`) 
        ]);
        
        const pontosFormatados: Ponto[] = responsePontos.data.map(ponto => ({
          id: `ponto-${ponto.id}`, // Cria ID único
          nome: ponto.nome,
          tipos: ponto.tipos_residuo.map(tipo => tipo.nome), 
          origem: 'ponto',
        }));

        const coopsFormatadas: Ponto[] = responseCoops.data.map(coop => ({
            id: `coop-${coop.id}`, // Cria ID único
            nome: coop.nome,
            tipos: coop.tipos_residuo.map(tipo => tipo.nome),
            origem: 'cooperativa',
        }));

        const dadosCombinados = [...pontosFormatados, ...coopsFormatadas];

        setTodosOsPontos(dadosCombinados);
        setPontosFiltrados(dadosCombinados); 
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        Alert.alert('Erro', 'Não foi possível carregar os pontos de coleta e cooperativas.');
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []); 

  const handleSearchSubmit = (searchText: string) => {
    if (!searchText) {
      setPontosFiltrados(todosOsPontos);
      return;
    }

    const textoBusca = searchText.toLowerCase();

    const resultado = todosOsPontos.filter(ponto => {
      const nomeMatch = ponto.nome.toLowerCase().includes(textoBusca);
      const tipoMatch = ponto.tipos.some(tipo => tipo.toLowerCase().includes(textoBusca));
      return nomeMatch || tipoMatch;
    });

    setPontosFiltrados(resultado);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: fundo, flex: 1 }}
      contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}
    >
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.25, height: width * 0.25, resizeMode: 'contain' }} />
      </View>

      <View style={{ width: '100%', alignItems: 'center', marginBottom: height * 0.04, marginTop: height * 0.01 }}>
        <Text style={{ color: texto, fontSize: width * 0.07, fontFamily: 'Poppins-Bold', marginBottom: 5, textAlign: 'center' }}>
          Pesquisar Locais
        </Text>
        <Text style={{ color: texto, fontSize: width * 0.035, fontFamily: 'Poppins-Regular', marginBottom: 20, textAlign: 'center', maxWidth: '80%' }}>
          Encontre cooperativas e ecopontos por nome ou tipo de resíduo.
        </Text>
        <PesquisaInput onSearch={handleSearchSubmit} />
      </View>
      
      <View style={{width: '100%'}}>
        {carregando ? (
          <ActivityIndicator size="large" color={texto} style={{marginTop: 30}} />
        ) : pontosFiltrados.length > 0 ? (
          pontosFiltrados.map(ponto => (
            <View key={ponto.id} style={{ width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 }}>
              <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-SemiBold', color: '#232323' }}>{ponto.nome}</Text>
              
              <Text style={{ fontSize: width * 0.03, fontFamily: 'Poppins-Medium', color: ponto.origem === 'ponto' ? '#007BFF' : '#28a745', marginTop: 2, textTransform: 'uppercase' }}>
                {ponto.origem === 'ponto' ? 'Ponto de Coleta' : 'Cooperativa'}
              </Text>

              <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: '#555', marginTop: 8 }}>Aceita: {ponto.tipos.join(', ')}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: texto, fontFamily: 'Poppins-Regular', textAlign: 'center', marginTop: 30}}>Nenhum resultado encontrado.</Text>
        )}
      </View>

    </ScrollView>
  );
}