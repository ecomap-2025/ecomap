import { Text, View } from 'react-native';

export default function MapaPlaceholderWeb() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>
        O mapa está disponível apenas no aplicativo móvel.
      </Text>
    </View>
  );
}