import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

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
          placeholder="Pesquisar por um local..."
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

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');

  const handleSearchSubmit = (searchText: string) => {
    console.log('Buscando por:', searchText);
    // Lógica para filtrar dados.
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: fundo, flex: 1 }}
      contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}
    >
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.03
      }}>
        <Image
          source={require('@/assets/imgs/logo.png')}
          style={{ width: width * 0.15, height: width * 0.15, resizeMode: 'contain' }}
        />
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                source={require('@/assets/imgs/icons/location.png')}
                style={{ width: width * 0.05, height: width * 0.05, tintColor: texto, marginRight: 5 }}
            />
            <Text style={{ color: texto, fontFamily: 'Poppins-Regular', fontSize: width * 0.04 }}>
                Contagem, MG
            </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ color: texto, fontSize: width * 0.07, fontFamily: 'Poppins-Semibold', marginBottom: 10 }}>PESQUISA</Text>
        <Text style={{ color: texto, fontSize: width * 0.03, fontFamily: 'Poppins-Regular', marginBottom: 20 }}>Pesquise por tipo de resíduo, nome da cooperativa ou ecoponto...</Text>

        <PesquisaInput onSearch={handleSearchSubmit} />
      </View>

    </ScrollView>
  );
}