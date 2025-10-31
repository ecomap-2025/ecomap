import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CadastrarPontoColetaScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [horario, setHorario] = useState('');
  const [tiposResiduos, setTiposResiduos] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !endereco) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios: Nome e Endereço.');
      return; 
    }
    
    setEnviando(true);

    const dadosParaApi = {
      nome: nome,
      endereco: endereco,
      telefone: telefone,
      email: email,
      horario_funcionamento: horario,
      tipos_residuos_aceitos: tiposResiduos.split(',').map(item => item.trim()).filter(item => item),
    };

    try {
      const response = await axios.post('https://ecomap-api-013m.onrender.com/api/pontos-coleta/', dadosParaApi);

      console.log('Ponto cadastrado com sucesso:', response.data);
      Alert.alert('Sucesso!', 'O novo ponto de coleta foi cadastrado.');
      router.back();

    } catch (error) { 
      let mensagemErro = 'Não foi possível cadastrar o ponto. Tente novamente mais tarde.';

      if (axios.isAxiosError(error)) {
        console.error("Erro de API:", error.response?.data || error.message);
        if (error.response?.data && typeof error.response.data === 'object') {
            const detalhesErro = Object.values(error.response.data).flat().join('\n');
            mensagemErro = `Erro ao cadastrar: \n${detalhesErro}`;
        }
      } else if (error instanceof Error) {
        console.error("Erro genérico:", error.message);
        mensagemErro = error.message;
      } else {
        console.error("Erro desconhecido:", error);
      }

      Alert.alert('Erro', mensagemErro);
      
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: fundo, flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}>
      
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.25, height: width * 0.25, resizeMode: 'contain' }} />
      </View>
      
      <View style={{ width: '100%', alignItems: 'center', marginBottom: height * 0.04, marginTop: height * 0.01 }}>
        <Text style={{ color: texto, fontSize: width * 0.07, fontFamily: 'Poppins-Semibold', marginBottom: 10 }}>CADASTRAR NOVO LOCAL</Text>
        <Text style={{ color: texto, fontSize: width * 0.03, fontFamily: 'Poppins-Regular', marginBottom: 20 }}>Nós ajude a mapear novos locais de coleta!</Text>
      </View>

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Nome do Ponto*</Text>
      <TextInput value={nome} onChangeText={setNome} placeholder="Ex: Ecoponto Central" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Endereço*</Text>
      <TextInput value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro e cidade" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Telefone (Opcional)</Text>
      <TextInput value={telefone} onChangeText={setTelefone} placeholder="(31) 99999-9999" placeholderTextColor="#888" keyboardType="phone-pad" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>E-mail (Opcional)</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="contato@ecoponto.com" placeholderTextColor="#888" keyboardType="email-address" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Horário de Funcionamento (Opcional)</Text>
      <TextInput value={horario} onChangeText={setHorario} placeholder="Seg a Sex, 08:00 - 18:00" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

      <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Tipos de Resíduos Aceitos</Text>
      <TextInput value={tiposResiduos} onChangeText={setTiposResiduos} placeholder="Pilhas, Plástico, Vidro (separados por vírgula)" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.04 }} />

      <TouchableOpacity disabled={enviando} onPress={handleCadastro} style={{ width: '100%', backgroundColor: enviando ? '#a9a9a9' : '#2a9d8f', borderRadius: 15, paddingVertical: height * 0.02, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#2a9d8f' }}>
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ fontFamily: 'Poppins-Bold', color: '#fff', fontSize: width * 0.045 }}>Confirmar Cadastro</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}