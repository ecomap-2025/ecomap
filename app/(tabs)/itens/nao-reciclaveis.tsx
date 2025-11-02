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
          source={require('@/assets/imgs/nao-reciclaveis.jpg')} 
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#606060', textAlign: 'center', marginTop: 15 }}>
        Não Recicláveis
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Resíduos não recicláveis, tecnicamente chamados de rejeitos, são materiais que não podem ser reintegrados ao ciclo produtivo por meio dos processos de reciclagem convencionais. Isso ocorre por falta de tecnologia, por contaminação ou pela composição do material. Exemplos incluem papel higiênico usado, fraldas descartáveis, absorventes, fotografias, fitas adesivas e esponjas de limpeza.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O principal impacto dos rejeitos é a sobrecarga dos aterros sanitários, ocupando um espaço valioso e reduzindo sua vida útil. Quando misturados incorretamente com materiais recicláveis, podem contaminar lotes inteiros, inviabilizando o reaproveitamento de plásticos, papéis e metais. A gestão inadequada desses resíduos aumenta a pressão sobre os recursos naturais, pois novos produtos precisam ser fabricados do zero.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Segregação Essencial:</Text> A ação mais importante é separar os rejeitos dos materiais recicláveis e orgânicos. Essa separação na fonte é crucial para o sucesso da coleta seletiva.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Destinação ao Lixo Comum:</Text> O local correto para os não recicláveis é a lixeira de lixo comum (ou de rejeitos). Eles serão recolhidos pelo serviço de limpeza urbana e encaminhados a um aterro sanitário licenciado.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Redução como Prioridade:</Text> A melhor forma de gerenciar os rejeitos é diminuir sua geração. Opte por produtos duráveis, com menos embalagens e que sejam recicláveis ou compostáveis.
        </Text>
      </View>
    </ScrollView>
  );
}