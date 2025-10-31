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
          source={require('@/assets/imgs/contaminados.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      {/* Título Principal */}
      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#cb3032', textAlign: 'center', marginTop: 15 }}>
        Resíduos Contaminados
      </Text>

      {/* Seção: O que é? */}
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Resíduos contaminados são materiais que, durante seu ciclo de uso, foram impregnados com substâncias químicas, biológicas ou tóxicas. Exemplos comuns incluem embalagens de agrotóxicos, latas de tinta, solventes, óleos lubrificantes e materiais hospitalares. A presença desses contaminantes os classifica como perigosos, exigindo um manejo diferenciado.
        </Text>
      </View>

      {/* Seção: Impacto no Meio Ambiente */}
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O descarte inadequado de resíduos contaminados acarreta severas consequências. As substâncias nocivas podem infiltrar-se no solo e atingir lençóis freáticos, contaminando fontes de água. A disposição em aterros comuns pode gerar gases tóxicos e comprometer a fauna e a flora locais, causando desequilíbrios ecossistêmicos de longa duração.
        </Text>
      </View>

      {/* Seção: Descarte Correto */}
      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Proibição do Descarte em Lixo Comum:</Text> É fundamental que resíduos contaminados não sejam misturados ao lixo doméstico ou reciclável, pois necessitam de tratamento específico.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Segregação Adequada:</Text> Realize a separação rigorosa desses materiais na fonte geradora, acondicionando-os em recipientes seguros e identificados.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Encaminhamento a Pontos de Coleta:</Text> O descarte deve ser realizado exclusivamente em postos de coleta especializados que garantem o encaminhamento para tratamento e disposição final adequados.
        </Text>
      </View>
    </ScrollView>
  );
}