import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#C8E6C9',
        tabBarStyle: {
          backgroundColor: '#3A6A50',
          height: 65,
          paddingBottom: 5,
          paddingTop: 5,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('@/assets/imgs/icons/home.png')}
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pesquisa"
        options={{
          title: 'Pesquisa',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('@/assets/imgs/icons/search.png')}
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('@/assets/imgs/icons/map.png')}
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="novo-local"
        options={{
          title: 'Novo local',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('@/assets/imgs/icons/add.png')}
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

    <Tabs.Screen
        name="educativo"
        options={{
          title: 'Educativo',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('@/assets/imgs/icons/class.png')}
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}