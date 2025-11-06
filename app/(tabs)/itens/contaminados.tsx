import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ContaminadosScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: fundo }}>
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/contaminados.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#6b6b6bff', textAlign: 'center', marginTop: 15 }}>
        Contaminados
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Resíduos contaminados são materiais que contêm substâncias tóxicas, inflamáveis, corrosivas ou patogênicas, representando um risco à saúde pública e ao meio ambiente. Incluem itens como pilhas, baterias, lâmpadas fluorescentes, embalagens de agrotóxicos, resíduos hospitalares (seringas, curativos) e produtos químicos vencidos.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O descarte incorreto de resíduos contaminados é extremamente prejudicial. Eles podem infiltrar-se no solo e atingir os lençóis freáticos, contaminando a água que consumimos e usamos na agricultura. Essas substâncias tóxicas podem se acumular na cadeia alimentar, afetando animais e plantas, e causar graves problemas de saúde em seres humanos.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Separação Absoluta:</Text> NUNCA misture esses itens com o lixo comum ou reciclável. Mantenha-os completamente separados desde o momento do uso.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Embalagem Segura:</Text> Armazene-os, se possível, em suas embalagens originais ou em recipientes resistentes e bem vedados para evitar vazamentos.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Pontos de Coleta Específicos:</Text> Leve os resíduos a locais de descarte apropriados. Supermercados e farmácias costumam recolher pilhas, baterias e medicamentos. Para outros itens, procure ecopontos ou consulte a prefeitura da sua cidade.
        </Text>
      </View>
    </ScrollView>
  );
}