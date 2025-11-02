import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VidrosScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: fundo }}>
      <View style={{ width: '100%', height: height * 0.3, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/imgs/vidro.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
        />
      </View>

      <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: '#15a85e', textAlign: 'center', marginTop: 15 }}>
        Vidros
      </Text>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          O que é?
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          Vidro reciclável é composto basicamente por areia, barrilha e calcário. Os itens mais comuns são garrafas de bebidas, potes de alimentos (geleias, conservas) e frascos de perfumes ou cosméticos. O vidro é um material 100% reciclável, podendo ser reutilizado infinitas vezes sem perder sua qualidade.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Impacto no Meio Ambiente
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5 }}>
          O vidro é um dos materiais que mais demora para se decompor na natureza, levando mais de 4.000 anos. Quando descartado de forma incorreta, pode causar acidentes e ferimentos em pessoas e animais. A reciclagem do vidro reduz a extração de matéria-prima da natureza, economiza energia e diminui a emissão de gases de efeito estufa.
        </Text>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 50 }}>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Descarte Correto
        </Text>
        <Text style={{ fontSize: width * 0.035, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'justify', marginTop: 5, lineHeight: 22 }}>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>1. Limpeza:</Text> Lave os potes e garrafas para remover os resíduos dos produtos. Retire as tampas, que geralmente são de plástico ou metal e devem ser recicladas separadamente.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>2. Cuidado com Quebras:</Text> Se o vidro estiver quebrado, embale-o cuidadosamente em jornal ou em uma caixa de papelão para evitar acidentes com os coletores.
          {'\n\n'}
          <Text style={{ fontFamily: 'Poppins-Bold' }}>3. Separação Adequada:</Text> Deposite os vidros na lixeira correta da coleta seletiva (geralmente verde). Atenção: espelhos, lâmpadas, vidros de janela (temperados) e cerâmicas não são recicláveis e devem ter outro destino.
        </Text>
      </View>
    </ScrollView>
  );
}