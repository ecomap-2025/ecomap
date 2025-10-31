import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const laranja = useThemeColor({}, 'primary');

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: height * 0.05, backgroundColor: fundo }}>
      <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.35, height: width * 0.35, marginBottom: 24, resizeMode: 'contain' }} />
      <Text style={{ fontSize: width * 0.05, fontFamily: 'Poppins-Regular', marginBottom: 5, color: texto }}>Bem-vindo(a) ao</Text>
    </ScrollView>
  );
}