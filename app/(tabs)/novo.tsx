import { useThemeColor } from '@/hooks/use-theme-color';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// 1. Definimos os tipos de cadastro possíveis
type TipoCadastro = 'ponto' | 'cooperativa' | 'residuo';

export default function CadastrarScreen() {
  const fundo = useThemeColor({}, 'background');
  const texto = useThemeColor({}, 'text');
  const router = useRouter();

  // --- ESTADOS ---
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>('ponto'); // Estado para controlar qual formulário mostrar
  
  // Estados para os campos (a maioria será reaproveitada)
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [horario, setHorario] = useState('');
  // O campo de resíduos agora é usado apenas para o cadastro de resíduo
  const [descricaoResiduo, setDescricaoResiduo] = useState('');
  
  const [enviando, setEnviando] = useState(false);

  // Função para limpar os campos após o sucesso
  const resetarFormulario = () => {
    setNome('');
    setEndereco('');
    setTelefone('');
    setEmail('');
    setHorario('');
    setDescricaoResiduo('');
  };

  const handleCadastro = async () => {
    setEnviando(true);
    let url = '';
    let dadosParaApi: any = {};
    let nomeDoItem = '';

    // 2. Lógica dinâmica para montar a URL e os dados com base no tipo selecionado
    switch (tipoCadastro) {
      case 'ponto':
        if (!nome || !endereco) {
          Alert.alert('Atenção', 'Nome e Endereço são obrigatórios para Pontos de Coleta.');
          setEnviando(false);
          return;
        }
        url = 'https://ecomap-api-013m.onrender.com/api/pontos-coleta/';
        dadosParaApi = { nome, endereco, telefone, email, horario_funcionamento: horario };
        nomeDoItem = 'Ponto de Coleta';
        break;

      case 'cooperativa':
        if (!nome) {
          Alert.alert('Atenção', 'Nome é obrigatório para Cooperativas.');
          setEnviando(false);
          return;
        }
        url = 'https://ecomap-api-013m.onrender.com/api/cooperativas/';
        dadosParaApi = { nome, endereco, telefone, email, horario_funcionamento: horario };
        nomeDoItem = 'Cooperativa';
        break;

      case 'residuo':
        if (!nome) {
          Alert.alert('Atenção', 'Nome é obrigatório para Tipos de Resíduo.');
          setEnviando(false);
          return;
        }
        url = 'https://ecomap-api-013m.onrender.com/api/tipos-residuo/';
        dadosParaApi = { nome, descricao: descricaoResiduo };
        nomeDoItem = 'Tipo de Resíduo';
        break;
    }

    try {
      const response = await axios.post(url, dadosParaApi);
      console.log(`${nomeDoItem} cadastrado(a) com sucesso:`, response.data);
      Alert.alert('Sucesso!', `${nomeDoItem} cadastrado(a) com sucesso.`);
      resetarFormulario();
      router.back();

    } catch (error) { 
      let mensagemErro = `Não foi possível cadastrar. Tente novamente.`;
      if (axios.isAxiosError(error)) {
        console.error("Erro de API:", error.response?.data || error.message);
        const detalhesErro = error.response?.data ? Object.values(error.response.data).flat().join('\n') : '';
        if (detalhesErro) mensagemErro = `Erro: \n${detalhesErro}`;
      } else {
        console.error("Erro desconhecido:", error);
      }
      Alert.alert('Erro', mensagemErro);
    } finally {
      setEnviando(false);
    }
  };

  // Componente para os botões de seleção
  const BotaoSelecao = ({ tipo, label }: { tipo: TipoCadastro, label: string }) => (
    <TouchableOpacity
      onPress={() => setTipoCadastro(tipo)}
      style={{
        flex: 1,
        paddingVertical: 12,
        backgroundColor: tipoCadastro === tipo ? '#2a9d8f' : '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
      }}
    >
      <Text style={{
        fontFamily: 'Poppins-SemiBold',
        color: tipoCadastro === tipo ? '#fff' : '#555',
        fontSize: width * 0.035
      }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: fundo, flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 }}>
      
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/imgs/logo.png')} style={{ width: width * 0.25, height: width * 0.25, resizeMode: 'contain' }} />
      </View>
      
      <View style={{ width: '100%', alignItems: 'center', marginBottom: height * 0.02, marginTop: height * 0.01 }}>
        <Text style={{ color: texto, fontSize: width * 0.07, fontFamily: 'Poppins-Bold', marginBottom: 5 }}>CADASTRAR</Text>
        <Text style={{ color: texto, fontSize: width * 0.035, fontFamily: 'Poppins-Regular' }}>Selecione o que você deseja adicionar:</Text>
      </View>

      {/* 3. Botões de Seleção */}
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: height * 0.04 }}>
        <BotaoSelecao tipo="ponto" label="Ponto de Coleta" />
        <BotaoSelecao tipo="cooperativa" label="Cooperativa" />
        <BotaoSelecao tipo="residuo" label="Resíduo" />
      </View>

      {/* 4. Renderização Condicional dos Formulários */}
      
      {/* Formulário para Ponto de Coleta e Cooperativa (campos compartilhados) */}
      {(tipoCadastro === 'ponto' || tipoCadastro === 'cooperativa') && (
        <>
          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Nome*</Text>
          <TextInput value={nome} onChangeText={setNome} placeholder={tipoCadastro === 'ponto' ? "Nome do Ecoponto" : "Nome da Cooperativa"} placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Endereço {tipoCadastro === 'ponto' ? '*' : '(Opcional)'}</Text>
          <TextInput value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro e cidade" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Telefone (Opcional)</Text>
          <TextInput value={telefone} onChangeText={setTelefone} placeholder="(31) 99999-9999" placeholderTextColor="#888" keyboardType="phone-pad" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>E-mail (Opcional)</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="contato@exemplo.com" placeholderTextColor="#888" keyboardType="email-address" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Horário de Funcionamento (Opcional)</Text>
          <TextInput value={horario} onChangeText={setHorario} placeholder="Seg a Sex, 08:00 - 18:00" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.04 }} />
        </>
      )}

      {/* Formulário para Tipo de Resíduo */}
      {tipoCadastro === 'residuo' && (
        <>
          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Nome do Resíduo*</Text>
          <TextInput value={nome} onChangeText={setNome} placeholder="Ex: Plástico, Bateria, Óleo de Cozinha" placeholderTextColor="#888" style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.02 }} />

          <Text style={{ width: '100%', fontFamily: 'Poppins-SemiBold', color: texto, fontSize: width * 0.04, marginBottom: height * 0.01 }}>Descrição (Opcional)</Text>
          <TextInput value={descricaoResiduo} onChangeText={setDescricaoResiduo} placeholder="Breve descrição sobre o resíduo" placeholderTextColor="#888" multiline style={{ backgroundColor: '#f0f0f0', width: '100%', borderRadius: 10, paddingVertical: height * 0.015, paddingHorizontal: width * 0.04, fontFamily: 'Poppins-Regular', fontSize: width * 0.04, color: '#333', marginBottom: height * 0.04, height: height * 0.1 }} />
        </>
      )}

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