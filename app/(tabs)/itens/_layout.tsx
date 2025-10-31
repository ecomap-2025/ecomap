// app/(tabs)/itens/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

export default function ItemLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, 
        headerBackVisible: false, 
        headerTransparent: true,
        headerShadowVisible: false,
        
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
              backgroundColor: 'rgba(67, 95, 72, 0.5)', 
              borderRadius: 20,
              padding: 4,
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </Pressable>
        ),
        
        headerStyle: {
          backgroundColor: 'transparent', 
        },
        headerTintColor: '#FFFFFF', 
      }}
    />
  );
}