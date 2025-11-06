import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PapeisScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: fundo }}>
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/papel.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#3d4594', textAlign: 'center', marginTop: 15 }}>
        Papéis
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Papéis recicláveis incluem uma vasta gama de produtos de celulose, como jornais, revistas, caixas de papelão, embalagens longa vida, folhas de caderno e envelopes. São materiais de origem vegetal, cuja produção e reciclagem são fundamentais para a conservação dos recursos naturais.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          A produção de papel a partir de celulose virgem exige o corte de árvores e consome grandes quantidades de água e energia. Quando descartados em aterros, os papéis se decompõem e liberam gás metano. A reciclagem de papel economiza milhares de árvores, reduz o consumo de água em mais de 50% e de energia em até 65%, além de diminuir a poluição.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Limpos e Secos:</Text> Para serem recicláveis, os papéis devem estar limpos e secos. Evite descartar papéis engordurados, sujos de tinta ou com restos de comida.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Não Amasse:</Text> Dê preferência a rasgar o papel em vez de amassá-lo. Isso preserva as fibras de celulose, facilitando o processo de reciclagem.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Separação Adequada:</Text> Deposite os papéis na lixeira da coleta seletiva (geralmente azul). Itens como papel higiênico, guardanapos sujos, fotografias e fitas adesivas não são recicláveis e devem ir para o lixo comum.
        </Text>
      </View>
    </ScrollView>
  );
}