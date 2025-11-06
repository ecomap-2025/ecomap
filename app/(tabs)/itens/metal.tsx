import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: fundo }}>
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/metal.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#ffcf2a', textAlign: 'center', marginTop: 15 }}>
        Metais
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Metais recicláveis, como aço e alumínio, são amplamente encontrados em produtos do dia a dia, incluindo latas de bebidas e alimentos, arames, panelas velhas e esquadrias de janelas. Caracterizados pela sua alta durabilidade e resistência, possuem alto valor e podem ser reciclados infinitas vezes sem perder qualidade, tornando-os um dos materiais mais sustentáveis no ciclo de reciclagem.
        </Text>
      </View>

      {/* Seção: Impacto no Meio Ambiente */}
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          A extração de minérios para a produção de metais virgens é um processo de alto impacto, causando desmatamento, poluição da água e consumo massivo de energia. Quando descartados incorretamente, os metais levam séculos para se decompor e podem contaminar o solo e a água com óxidos e substâncias tóxicas. A reciclagem de metais economiza até 95% da energia necessária para produzi-los a partir da matéria-prima.
        </Text>
      </View>

      {/* Seção: Descarte Correto */}
      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Higienização:</Text> Lave as latas e embalagens metálicas para remover resíduos de alimentos, o que facilita o processo de reciclagem e evita a atração de vetores.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Separação:</Text> Deposite os metais na lixeira destinada à coleta seletiva (geralmente identificada pela cor amarela), junto com outros materiais da mesma categoria.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Atenção a Itens Especiais:</Text> Pilhas, baterias e lixo eletrônico contêm metais pesados e NUNCA devem ser descartados no lixo comum ou reciclável. Procure pontos de coleta específicos para esses itens.
        </Text>
      </View>
    </ScrollView>
  );
}