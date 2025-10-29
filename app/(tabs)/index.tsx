import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const DUMMY_HIGHLIGHTS = [
  { id: '1', title: 'Local 1', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AmtWnHFWNPj9eoa86FLKkapHDXwJGOaXMA&s' },
  { id: '2', title: 'Local 2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AmtWnHFWNPj9eoa86FLKkapHDXwJGOaXMA&s' },
  { id: '3', title: 'Local 3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AmtWnHFWNPj9eoa86FLKkapHDXwJGOaXMA&s' },
];

const DUMMY_NEARBY = [
  { id: '4', title: 'Local 4', category: 'Papel e plástico', distance: '1.2km' },
  { id: '5', title: 'Local 5', category: 'Madeira e papel', distance: '2.5km' },
];

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: fundo, flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => router.push('/autenticacao/login')}>
          <Image source={require('@/assets/imgs/icons/logout.png')} style={{ width: width * 0.1, height: width * 0.1, resizeMode: 'contain' }} />
        </Pressable>
        <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.35, height: width * 0.35, resizeMode: 'contain' }} />
        <Pressable onPress={() => router.push('/perfil')}>
          <Image source={require('@/assets/imgs/icons/account.png')} style={{ width: width * 0.1, height: width * 0.1, resizeMode: 'contain' }} />
        </Pressable>
      </View>

      <View style={{ width: '100%', alignItems: 'center', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.07, fontFamily: 'Poppins-Bold', color: texto }}>Olá, Usuário!</Text>
        <Text style={{ fontSize: width * 0.04, fontFamily: 'Poppins-Regular', color: texto }}>Seja bem-vindo(a) ao EcoMap!</Text>
      </View>

      <TouchableOpacity style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: 15, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, marginBottom: height * 0.03, flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(tabs)/pesquisa')}>
        <Image source={require('@/assets/imgs/icons/search.png')} style={{ width: width * 0.05, height: width * 0.05, tintColor: '#888', marginRight: width * 0.03 }} />
        <Text style={{ fontFamily: 'Poppins-Regular', color: '#888', fontSize: width * 0.04 }}>Pesquisar por um local...</Text>
      </TouchableOpacity>

      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.06, fontFamily: 'Poppins-SemiBold', marginBottom: height * 0.02, color: texto }}>Destaques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DUMMY_HIGHLIGHTS.map(item => (
            <TouchableOpacity key={item.id} style={{ width: width * 0.4, marginRight: width * 0.04 }}>
              <Image source={{ uri: item.image }} style={{ width: '100%', height: width * 0.4, borderRadius: 15, marginBottom: height * 0.01 }} />
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: width * 0.035, color: texto }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ fontSize: width * 0.06, fontFamily: 'Poppins-SemiBold', marginBottom: height * 0.02, color: texto }}>Perto de Você</Text>
        {DUMMY_NEARBY.map(item => (
          <TouchableOpacity key={item.id} style={{ backgroundColor: '#fff', borderRadius: 10, padding: width * 0.04, marginBottom: height * 0.015, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 }}>
            <View>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: width * 0.04, color: '#333' }}>{item.title}</Text>
              <Text style={{ fontFamily: 'Poppins-Regular', color: '#777', fontSize: width * 0.03 }}>{item.category} • {item.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
