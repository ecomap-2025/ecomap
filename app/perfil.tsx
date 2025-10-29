import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const laranja = useThemeColor({}, 'primary');

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: fundo }]}>
      
      <Text style={[styles.subtitle, { color: texto }]}>PERFIL</Text>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.05,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: width * 0.05,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  title: {
    fontSize: width * 0.12,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  mainImage: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.35)',
    elevation: 6,
  },
  buttonText: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  }
});
