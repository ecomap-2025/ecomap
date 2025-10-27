import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const laranja = useThemeColor({}, 'primary');

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: fundo }]}>
      <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      
      <Text style={[styles.subtitle, { color: texto }]}>Bem-vindo(a) ao</Text>
      <Text style={[styles.title, { color: texto }]}>EcoMap</Text>
      
      <Image source={require('@/assets/imgs/imagem.png')} style={styles.mainImage} />
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { 
            backgroundColor: laranja,
            opacity: pressed ? 0.7 : 1,
            shadowOpacity: pressed ? 0.2 : 0.35
          }
        ]}
        onPress={() => router.push('/login')}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>COMEÇAR</Text>
      </Pressable>

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,

  },
  buttonText: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  }
});
