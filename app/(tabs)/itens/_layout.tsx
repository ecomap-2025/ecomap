import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

export default function ItemLayout() {
  const fundo = useThemeColor({}, 'background');

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: fundo,
        },
        headerTitle: () => (
          <Image
            source={require('@/assets/imgs/logo.png')}
            style={{
              width: width * 0.15,
              height: width * 0.15,
              resizeMode: 'contain',
            }}
          />
        ),
        headerLeft: () => (
          <Pressable
            onPress={() => {
              router.replace('/(tabs)/educativo');
            }}
            style={{
              marginLeft: 10,
              borderRadius: 20,
              padding: 4,
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </Pressable>
        ),
        headerTintColor: '#FFFFFF',
      }}
    />
  );
}
