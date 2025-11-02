import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OrganicosScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: fundo }}>
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/organico.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#6b422f', textAlign: 'center', marginTop: 15 }}>
        Orgânicos
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Resíduos orgânicos são todos os materiais de origem biológica, seja animal ou vegetal. Isso inclui restos de alimentos como cascas de frutas e legumes, borra de café, sobras de refeições e aparas de jardim como folhas secas, galhos e grama. São materiais biodegradáveis que se decompõem naturalmente.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Quando descartados em aterros sanitários comuns, os resíduos orgânicos se decompõem sem oxigênio, liberando gás metano, que é um dos principais gases do efeito estufa, muito mais potente que o CO₂. Além disso, a decomposição gera o chorume, um líquido escuro e tóxico que pode contaminar o solo e as águas subterrâneas.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Compostagem:</Text> A forma mais sustentável de descarte é a compostagem. Você pode ter uma composteira em casa para transformar seus resíduos orgânicos em adubo rico em nutrientes para plantas.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Separação:</Text> Separe sempre o lixo orgânico dos materiais recicláveis e dos rejeitos. Utilize um recipiente adequado, de preferência com tampa, para armazená-lo.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Coleta Seletiva:</Text> Informe-se se seu município oferece coleta seletiva para resíduos orgânicos. Caso positivo, descarte-os nos dias e locais indicados para que sejam levados a usinas de compostagem.
        </Text>
      </View>
    </ScrollView>
  );
}