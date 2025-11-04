import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://ecomap-api-013m.onrender.com/api';


// --- Interfaces ---

interface ApiTipoResiduo {
  id: number;
  nome: string;
}

interface ApiCooperativa {
  id: number;
  nome: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  localizacao: any; 
  tipos_residuos_aceitos: number[];
}

interface ApiPontoProperties {
  id: number;
  nome: string;
  horario_funcionamento: string;
  telefone: string;
  email: string;
  endereco: string;
  localizacao: any;
  tipos_residuos_aceitos: number[];
}
interface GeoJSONFeature {
  type: string;
  properties: ApiPontoProperties;
  geometry: any; 
}

interface Ponto {
  id: string; 
  nome: string;
  tipos: string[];
  origem: 'ponto' | 'cooperativa';
  responsavel: string | null;
  horario_funcionamento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  localizacao: any;
}


// --- Componente PesquisaInput ---

function PesquisaInput({ onSearch }: { onSearch: (searchText: string) => void; }) {
  const [query, setQuery] = useState('');
  
  const handleChange = (text: string) => {
    setQuery(text);
  };
  const handleSearch = () => {
    onSearch(query);
  };
  
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
  const [tiposResiduoMap, setTiposResiduoMap] = useState<Map<number, string>>(new Map());

  const [modalVisivel, setModalVisivel] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);


  const converterIdsParaNomes = (ids: number[], map: Map<number, string>): string[] => {
    if (!ids || !map) return [];
    return ids.map(id => map.get(id) || 'Desconhecido').filter(Boolean);
  };

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true);
      try {
        const [responseTipos, responsePontos, responseCoops] = await Promise.all([
          axios.get<ApiTipoResiduo[]>(`${API_BASE_URL}/tipos-residuo/`),
          axios.get<any>(`${API_BASE_URL}/pontos-coleta/`),
          axios.get<any>(`${API_BASE_URL}/cooperativas/`)
        ]);
        
        const tiposMap = new Map(responseTipos.data.map(tipo => [tipo.id, tipo.nome]));
        setTiposResiduoMap(tiposMap); 

        const dadosPontos: GeoJSONFeature[] = responsePontos.data.features;
        if (!Array.isArray(dadosPontos)) {
           throw new Error("Formato de dados inesperado (pontos-coleta não tem 'features')");
        }
        
        const pontosFormatados: Ponto[] = dadosPontos.map(feature => ({
          id: `ponto-${feature.properties.id}`, 
          nome: feature.properties.nome,
          tipos: converterIdsParaNomes(feature.properties.tipos_residuos_aceitos, tiposMap), 
          origem: 'ponto',
          responsavel: null, 
          horario_funcionamento: feature.properties.horario_funcionamento,
          telefone: feature.properties.telefone,
          email: feature.properties.email,
          endereco: feature.properties.endereco,
          localizacao: feature.properties.localizacao,
        }));

        const dadosCoops: ApiCooperativa[] = responseCoops.data;
        if (!Array.isArray(dadosCoops)) {
           throw new Error("Formato de dados inesperado (cooperativas não é um array)");
        }
        
        const coopsFormatadas: Ponto[] = dadosCoops.map(coop => ({
          id: `coop-${coop.id}`, 
          nome: coop.nome,
          tipos: converterIdsParaNomes(coop.tipos_residuos_aceitos, tiposMap),
          origem: 'cooperativa',
          responsavel: coop.responsavel,
          horario_funcionamento: null, 
          telefone: coop.telefone,
          email: coop.email,
          endereco: coop.endereco,
          localizacao: coop.localizacao,
        }));

        const dadosCombinados = [...pontosFormatados, ...coopsFormatadas];

        setTodosOsPontos(dadosCombinados);
        setPontosFiltrados(dadosCombinados); 

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        const msg = error instanceof Error ? error.message : 'Não foi possível carregar os dados.';
        Alert.alert('Erro', msg);
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

  const handleAbrirModal = (ponto: Ponto) => {
    setPontoSelecionado(ponto);
    setModalVisivel(true);
  };

  const handleFecharModal = () => {
    setModalVisivel(false);
    setPontoSelecionado(null);
  };

  const handleAbrirMapa = (ponto: Ponto) => {
    let url = '';
    
    if (ponto.localizacao && ponto.localizacao.coordinates) {
        const [longitude, latitude] = ponto.localizacao.coordinates;
        url = `https://www.google.com/maps/search/?api=1&query=$${latitude},${longitude}`;
    } 
    else if (ponto.endereco) {
        url = `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(ponto.endereco)}`;
    } 
    else {
        Alert.alert("Erro", "Este local não possui um endereço ou localização cadastrada.");
        return;
    }
    
    Linking.openURL(url).catch(err => Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas."));
  };


  return (
    <View style={{ backgroundColor: fundo, flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
              <TouchableOpacity key={ponto.id} onPress={() => handleAbrirModal(ponto)} activeOpacity={0.7}>
                <View style={{ width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 }}>
                  <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-SemiBold', color: '#232323' }}>{ponto.nome}</Text>
                  
                  <Text style={[{ fontSize: width * 0.03, fontFamily: 'Poppins-Medium', marginTop: 2, textTransform: 'uppercase' }, { color: ponto.origem === 'ponto' ? '#007BFF' : '#28a745' }]}>
                    {ponto.origem === 'ponto' ? 'Ponto de Coleta' : 'Cooperativa'}
                  </Text>

                  <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: '#555', marginTop: 8 }}>
                    Aceita: {ponto.tipos.length > 0 ? ponto.tipos.join(', ') : 'Não especificado'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{color: texto, fontFamily: 'Poppins-Regular', textAlign: 'center', marginTop: 30}}>Nenhum resultado encontrado.</Text>
          )}
        </View>

      </ScrollView>

      {/* --- Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={handleFecharModal}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, paddingBottom: 35, alignItems: 'flex-start', maxHeight: '80%' }}>
            {pontoSelecionado && (
              <>
                <Text style={{ fontSize: width * 0.06, fontFamily: 'Poppins-Bold', color: '#232323', marginBottom: 5 }}>{pontoSelecionado.nome}</Text>
                
                <Text style={[{ fontSize: width * 0.03, fontFamily: 'Poppins-Medium', marginTop: 2, textTransform: 'uppercase' }, { color: pontoSelecionado.origem === 'ponto' ? '#007BFF' : '#28a745', marginBottom: 15 }]}>
                  {pontoSelecionado.origem === 'ponto' ? 'Ponto de Coleta' : 'Cooperativa'}
                </Text>
                
                {pontoSelecionado.origem === 'cooperativa' && (
                  <>
                    <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 15 }}>Responsável:</Text>
                    <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 5 }}>{pontoSelecionado.responsavel || 'Não informado'}</Text>
                  </>
                )}

                {pontoSelecionado.origem === 'ponto' && (
                  <>
                    <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 15 }}>Horário de Funcionamento:</Text>
                    <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 5 }}>{pontoSelecionado.horario_funcionamento || 'Não informado'}</Text>
                  </>
                )}
                
                <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 15 }}>Telefone:</Text>
                <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 5 }}>{pontoSelecionado.telefone || 'Não informado'}</Text>

                <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 15 }}>Email:</Text>
                <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 5 }}>{pontoSelecionado.email || 'Não informado'}</Text>

                <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 15 }}>Endereço:</Text>
                <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 5 }}>{pontoSelecionado.endereco || 'Não informado'}</Text>

                <View style={{ width: '100%', marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity style={[{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 }, {backgroundColor: '#232323'}]} onPress={() => handleAbrirMapa(pontoSelecionado)}>
                    <Text style={{ color: 'white', fontSize: width * 0.04, fontFamily: 'Poppins-SemiBold' }}>Ver no Mapa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 }, {backgroundColor: '#6c757d'}]} onPress={handleFecharModal}>
                    <Text style={{ color: 'white', fontSize: width * 0.04, fontFamily: 'Poppins-SemiBold' }}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}