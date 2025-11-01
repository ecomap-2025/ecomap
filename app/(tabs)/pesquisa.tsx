import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios'; // 1. Importar o axios
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ApiTipoResiduo {
  id: number;
  nome: string;
}

interface ApiPontoColeta {
  id: number;
  nome: string;
  tipos_residuo: ApiTipoResiduo[];
}

interface Ponto {
  id: number;
  nome: string;
  tipos: string[]; 
}


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

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  
  const [carregando, setCarregando] = useState(true);
  const [todosOsPontos, setTodosOsPontos] = useState<Ponto[]>([]);
  const [pontosFiltrados, setPontosFiltrados] = useState<Ponto[]>([]);

  useEffect(() => {
    const buscarPontos = async () => {
      try {
        const response = await axios.get<ApiPontoColeta[]>('https://ecomap-api-013m.onrender.com/api/pontos-coleta/');
        
        const pontosFormatados = response.data.map(ponto => ({
          id: ponto.id,
          nome: ponto.nome,
          tipos: ponto.tipos_residuo.map(tipo => tipo.nome), 
        }));

        setTodosOsPontos(pontosFormatados);
        setPontosFiltrados(pontosFormatados); 
      } catch (error) {
        console.error("Erro ao buscar pontos de coleta:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarPontos();
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
              <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: '#555', marginTop: 4 }}>Aceita: {ponto.tipos.join(', ')}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: texto, fontFamily: 'Poppins-Regular', textAlign: 'center', marginTop: 30}}>Nenhum resultado encontrado.</Text>
        )}
      </View>

    </ScrollView>
  );
}