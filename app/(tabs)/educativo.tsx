import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type RouteType = '/itens/plastico' | '/itens/papel' | '/itens/metal' | '/itens/organico' | '/itens/vidro' | '/itens/nao-reciclaveis'| '/itens/perigosos'| '/itens/contaminados';

export default function InicioScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  const buttonColors = {
    PLÁSTICO: '#cb3032', 
    PAPEL: '#3d4594',   
    METAL: '#ffcf2a',   
    ORGANICO: '#6b422f', 
    VIDRO: '#15a85e',  
    PERIGOSOS: '#ff6800',
    NAORECICLAVEIS: '#FF0000',
    CONTAMINADOS: '#1e1b1c'  
  };
return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={{ backgroundColor: fundo, flex: 1 }} 
      contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05 }}
    >
      <View style={{ marginBottom: height * 0.03 }}>
        <Image 
          source={require('@/assets/imgs/logo.png')} 
          style={{ width: width * 0.35, height: width * 0.35, resizeMode: 'contain' }} 
        />
      </View>

      <View style={{ alignItems: 'center', marginBottom: height * 0.03, paddingHorizontal: width * 0.05 }}>
        <Text style={{ fontSize: width * 0.08, fontFamily: 'Poppins-Bold', color: texto, textAlign: 'center' }}>
          Guia de Descarte Consciente
        </Text>
        <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-Regular', color: texto, textAlign: 'center', marginTop: 5 }}>
          Selecione um material abaixo para ver as dicas de preparo e o impacto ambiental.
        </Text>
      </View>

      <View style={{ 
        flexDirection: 'row',   
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: width * 0.04,
      }}>
        {[{
          label: 'PLÁSTICO',
          route: '/itens/plastico' as RouteType, 
        }, {
          label: 'PAPEL',
          route: '/itens/papel' as RouteType, 
        }, {
          label: 'METAL',
          route: '/itens/metal' as RouteType, 
        }, {
          label: 'ORGANICO',
          route: '/itens/organico' as RouteType,
        }, {
          label: 'VIDRO',
          route: '/itens/vidro' as RouteType, 
        }, {
          label: 'PERIGOSOS',
          route: '/itens/perigosos' as RouteType, 
        },{
          label: 'NÃO RECICLÁVEIS',
          route: '/itens/nao-reciclaveis' as RouteType, 
        },{
          label: 'CONTAMINADOS',
          route: '/itens/contaminados' as RouteType, 
        }].map((item, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(item.route)}
            style={({ pressed }) => ({
              width: '48%', 
              marginBottom: height * 0.02, 
              paddingVertical: 15, 
              paddingHorizontal: 10,
              borderRadius: 12,
              flexDirection: 'column',
              alignItems: 'center',   
              justifyContent: 'center',
              backgroundColor: buttonColors[item.label as keyof typeof buttonColors],
              opacity: pressed ? 0.7 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 }, 
              shadowRadius: 8,
              elevation: 8,
              shadowOpacity: pressed ? 0.2 : 0.4,
            })}
          >
            <Text 
              style={{ 
                fontSize: width * 0.038, 
                fontFamily: 'Poppins-SemiBold', 
                color: '#fff', 
                textAlign: 'center' 
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
