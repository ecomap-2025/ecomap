// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// // Importamos o 'Region' para tipar nosso estado de região
// import * as Location from 'expo-location';
// import MapView, { Marker, Region, UrlTile } from 'react-native-maps';
// // Importamos os tipos específicos do 'expo-location'
// import { LocationObject, PermissionStatus } from 'expo-location';

// // --- 1. DEFINIÇÃO DE TIPOS (A principal mudança TSX) ---

// // Definimos os 'tipos' literais que nossos lugares podem ter
// type LugarTipo = 'restaurante' | 'padaria' | 'loja' | 'outro';

// // Criamos uma interface para o objeto 'Lugar'
// interface Lugar {
//   id: number;
//   nome: string;
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
//   tipo: LugarTipo;
// }

// // --- NOSSOS DADOS FICTÍCIOS (Agora tipados) ---
// // Note o 'as const' em 'outro' para manter o tipo literal
// const meusLugares: Lugar[] = [
//   {
//     id: 1,
//     nome: 'Restaurante da Praça',
//     coords: { latitude: -19.917299, longitude: -43.937813 },
//     tipo: 'restaurante',
//   },
//   {
//     id: 2,
//     nome: 'Padaria Pão Quente',
//     coords: { latitude: -19.921000, longitude: -43.938000 },
//     tipo: 'padaria',
//   },
//   {
//     id: 3,
//     nome: 'Loja de Calçados',
//     coords: { latitude: -19.919500, longitude: -43.939000 },
//     tipo: 'loja',
//   },
//   {
//     id: 4,
//     nome: 'Banca de Jornal',
//     coords: { latitude: -19.918000, longitude: -43.937000 },
//     tipo: 'outro', // <--- Tipo 'outro'
//   },
// ];

// const osmTileUrl = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png";

// // --- Funções de Ajuda (Agora tipadas) ---

// // O parâmetro 'tipo' agora é do tipo 'LugarTipo'
// const getMarkerColor = (tipo: LugarTipo): string => {
//   switch (tipo) {
//     case 'restaurante': return '#E67E22'; // Laranja
//     case 'padaria': return '#F1C40F'; // Amarelo
//     case 'loja': return '#3498DB'; // Azul
//     default: return '#95A5A6'; // Cinza (para 'outro')
//   }
// };

// // O parâmetro 'tipo' também é 'LugarTipo'
// const getMarkerLetter = (tipo: LugarTipo): string => {
//   switch (tipo) {
//     case 'restaurante': return 'R';
//     case 'padaria': return 'P';
//     case 'loja': return 'L';
//     default: return '📍';
//   }
// };

// // --- Componente Principal ---

// export default function App() {
//   // --- 2. ESTADOS TIPADOS ---
//   const [initialRegion, setInitialRegion] = useState<Region | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       // Pedir permissão
//       let { status } = await Location.requestForegroundPermissionsAsync();
      
//       // Usamos o Enum 'PermissionStatus' para checagem de tipo
//       if (status !== PermissionStatus.GRANTED) {
//         setErrorMsg('Permissão de localização negada.');
//         // Define uma região inicial padrão se a permissão for negada
//         setInitialRegion({
//           latitude: -19.917299,
//           longitude: -43.937813,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//         return;
//       }

//       // Pegar a localização (tipada como 'LocationObject')
//       let location: LocationObject = await Location.getCurrentPositionAsync({});
      
//       setInitialRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//     })();
//   }, []);

//   // --- Renderização condicional ---
//   if (errorMsg) {
//     return (
//       <View style={styles.container}>
//         <Text>{errorMsg}</Text>
//       </View>
//     );
//   }

//   if (!initialRegion) {
//     return (
//       <View style={styles.container}>
//         <Text>Carregando mapa...</Text>
//       </View>
//     );
//   }

//   // --- Renderização do Mapa ---
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={initialRegion}
//         showsUserLocation={true} // O "ponto azul" do usuário
//       >
//         {/* O mapa base do OpenStreetMap */}
//         <UrlTile
//           urlTemplate={osmTileUrl}
//           maximumZ={19}
//         />

//         {/* --- 3. MARCADORES TEMPORÁRIOS CUSTOMIZADOS --- */}
//         {/* Graças ao TS, 'lugar' aqui é automaticamente 'Lugar' */}
//         {meusLugares.map(lugar => {
//           const cor = getMarkerColor(lugar.tipo);
//           const letra = getMarkerLetter(lugar.tipo);

//           return (
//             <Marker
//               key={lugar.id}
//               coordinate={lugar.coords}
//               title={lugar.nome}
//             >
//               {/* Aqui começa a customização visual */}
//               <View style={[styles.markerContainer, { backgroundColor: cor }]}>
//                 <Text style={styles.markerText}>{letra}</Text>
//               </View>
//               {/* Um "triângulo" para apontar para o local exato */}
//               <View style={[styles.markerTriangle, { borderTopColor: cor }]} />
//             </Marker>
//           );
//         })}
//       </MapView>
//     </View>
//   );
// }

// // --- ESTILOS ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   markerContainer: {
//     width: 30,
//     height: 30,
//     borderRadius: 15, // Círculo perfeito
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5, // Sombra para Android
//     shadowColor: '#000', // Sombra para iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//   },
//   markerText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   markerTriangle: {
//     // Truque de CSS/RN para fazer um triângulo
//     width: 0,
//     height: 0,
//     backgroundColor: 'transparent',
//     borderStyle: 'solid',
//     borderLeftWidth: 6,
//     borderRightWidth: 6,
//     borderTopWidth: 10,
//     borderLeftColor: 'transparent',
//     borderRightColor: 'transparent',
//     alignSelf: 'center',
//     marginTop: -2, // "Gruda" na parte de baixo do círculo
//   },
// });



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