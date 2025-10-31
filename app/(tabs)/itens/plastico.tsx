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
      {/* Imagem de Cabeçalho */}
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/plastico.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      {/* Título Principal */}
      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#cb3032', textAlign: 'center', marginTop: 15 }}>
        Plástico
      </Text>

      {/* Seção: O que é? */}
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O plástico é um material polimérico, majoritariamente derivado de fontes não renováveis como o petróleo. Sua versatilidade, baixo custo e durabilidade o tornaram onipresente na sociedade moderna, sendo utilizado em embalagens, componentes eletrônicos, vestuário e inúmeros outros produtos.
        </Text>
      </View>

      {/* Seção: Impacto no Meio Ambiente */}
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O principal impacto ambiental do plástico reside em sua extrema longevidade, podendo levar centenas de anos para se decompor. No ambiente, ele polui ecossistemas terrestres e aquáticos, além de se fragmentar em microplásticos, que contaminam a água, o solo e a cadeia alimentar global.
        </Text>
      </View>

      {/* Seção: Descarte Correto */}
      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Higienização:</Text> Lave as embalagens plásticas para remover resíduos orgânicos. Essa ação simples evita a contaminação de outros materiais recicláveis.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Separação:</Text> Deposite todos os tipos de plásticos recicláveis na lixeira destinada à coleta seletiva (geralmente identificada pela cor vermelha).
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Redução do Consumo:</Text> A medida mais eficaz é reduzir o consumo de plásticos descartáveis. Opte por produtos com embalagens sustentáveis e utilize alternativas reutilizáveis.
        </Text>
      </View>
    </ScrollView>
  );
}