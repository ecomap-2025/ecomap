import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const laranja = useThemeColor({}, 'primary');
  const verdeClaro = useThemeColor({}, 'gradientLight');
  const verdeEscuro = useThemeColor({}, 'gradientDark');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confSenha, setConfSenha] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.35, height: width * 0.35, marginTop: height * 0.05, marginBottom: 10, resizeMode: 'contain' }} />
          <Text style={{ fontSize: width * 0.12, fontFamily: 'Poppins-Bold', color: texto }}>EcoMap</Text>
          
          <LinearGradient 
            colors={[verdeClaro, verdeEscuro]} 
            style={{ flex: 1, width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50, marginTop: 50, alignItems: 'center', paddingVertical: 40 }}
          >
            <Text style={{ fontSize: width * 0.07, fontFamily: 'Poppins-SemiBold', marginBottom: 30, color: texto }}>CADASTRO</Text>

            <TextInput 
              style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, fontSize: 16, color: '#333', marginBottom: 20 }}
              onChangeText={setNome} 
              value={nome}
              placeholder="Nome"
              placeholderTextColor="#999"
              secureTextEntry={false}
            />

            <TextInput 
              style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, fontSize: 16, color: '#333', marginBottom: 20 }}
              onChangeText={setEmail} 
              value={email}
              placeholder="E-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />

            <TextInput 
              style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, fontSize: 16, color: '#333', marginBottom: 20 }}
              onChangeText={setSenha} 
              value={senha}
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry={true}
            />

            <TextInput 
              style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, fontSize: 16, color: '#333', marginBottom: 20 }}
              onChangeText={setConfSenha} 
              value={confSenha}
              placeholder="Confirmar senha"
              placeholderTextColor="#999"
              secureTextEntry={true}
            />

            <Pressable
              style={({ pressed }) => ({ marginTop: 20, paddingVertical: 10, paddingHorizontal: 60, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowRadius: 6, elevation: 6, backgroundColor: laranja, opacity: pressed ? 0.7 : 1, shadowOpacity: pressed ? 0.2 : 0.35 })}
              onPress={() => router.push('/autenticacao/login')}
            >
              <Text style={{ fontSize: width * 0.045, fontFamily: 'Poppins-SemiBold', color: '#ffffff' }}>
                CADASTRAR
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => router.push('/autenticacao/login')}
            >
              <Text style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 60, borderRadius: 12, alignItems: 'center', elevation: 6, color: '#232323' }}>
                Já possui cadastro?{' '}
                <Text style={{ fontFamily: 'Poppins-Bold' }}>Fazer login</Text>
              </Text>
            </Pressable>

          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}