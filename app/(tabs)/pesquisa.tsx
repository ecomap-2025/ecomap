import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useState } from 'react';
// A importação do StyleSheet foi removida pois não é mais utilizada
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// --- Componente PesquisaInput (sem alterações) ---
interface PesquisaInputProps {
  onSearch: (searchText: string) => void;
}

function PesquisaInput({ onSearch }: PesquisaInputProps) {
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
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={{ color: '#232323', fontFamily: 'Poppins-SemiBold' }}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// --- Tela Principal com a Lógica ---
export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  
  const DADOS_TESTE = [
    { id: 1, nome: 'Ecoponto Central', tipos: ['Plástico', 'Vidro', 'Metal'] },
    { id: 2, nome: 'Coop. Recicla Mais', tipos: ['Papel', 'Papelão'] },
    { id: 3, nome: 'Descarte Eletrônico BH', tipos: ['Baterias', 'Celulares', 'Eletrônicos'] },
    { id: 4, nome: 'Ponto Verde Savassi', tipos: ['Óleo de Cozinha', 'Plástico'] },
  ];

  const [carregando, setCarregando] = useState(true);
  const [todosOsPontos, setTodosOsPontos] = useState(DADOS_TESTE);
  const [pontosFiltrados, setPontosFiltrados] = useState(DADOS_TESTE);

  useEffect(() => {
    setTimeout(() => {
      setTodosOsPontos(DADOS_TESTE);
      setPontosFiltrados(DADOS_TESTE);
      setCarregando(false);
    }, 1500);
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
        <Text style={{ color: texto, fontSize: width * 0.07, fontFamily: 'Poppins-Semibold', marginBottom: 10 }}>PESQUISA</Text>
        <Text style={{ color: texto, fontSize: width * 0.03, fontFamily: 'Poppins-Regular', marginBottom: 20 }}> Pesquise por tipo de resíduo, nome da cooperativa ou ecoponto...</Text>
        <PesquisaInput onSearch={handleSearchSubmit} />
      </View>
      
      <View style={{width: '100%'}}>
        {carregando ? (
          <ActivityIndicator size="large" color="#2a9d8f" />
        ) : pontosFiltrados.length > 0 ? (
          pontosFiltrados.map(ponto => (
            <View key={ponto.id} style={{ width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 }}>
              <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-SemiBold', color: '#232323' }}>{ponto.nome}</Text>
              <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: '#555' }}>Aceita: {ponto.tipos.join(', ')}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: texto, fontFamily: 'Poppins-Regular', textAlign: 'center'}}>Nenhum resultado encontrado.</Text>
        )}
      </View>

    </ScrollView>
  );
}