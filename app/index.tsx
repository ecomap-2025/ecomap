import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const laranja = useThemeColor({}, 'primary');
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: height * 0.05,
      backgroundColor: fundo,
    },
    logo: {
      width: width * 0.35,
      height: width * 0.35,
      marginBottom: 24,
      resizeMode: 'contain',
    },
    welcomeText: {
      fontSize: width * 0.05,
      fontFamily: 'Poppins-Regular',
      marginBottom: 5,
      color: texto,
    },
    appName: {
      fontSize: width * 0.12,
      fontFamily: 'Poppins-Bold',
      marginBottom: 24,
      textAlign: 'center',
      color: texto,
    },
    image: {
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
      shadowRadius: 6,
      elevation: 6,
      backgroundColor: laranja,
      opacity: 1,
      shadowOpacity: 0.35,
    },
    buttonPressed: {
      opacity: 0.7,
      shadowOpacity: 0.2,
    },
    buttonText: {
      fontSize: width * 0.045,
      fontFamily: 'Poppins-SemiBold',
      color: '#fff',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('@/assets/imgs/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Bem-vindo(a) ao</Text>
      <Text style={styles.appName}>EcoMap</Text>
      <Image source={require('@/assets/imgs/imagem.png')} style={styles.image} />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.buttonText}>COMEÇAR</Text>
      </Pressable>
    </ScrollView>
  );
}
