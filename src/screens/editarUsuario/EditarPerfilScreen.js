import React, { useState, useContext } from "react";
import {
  Text,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import { UserContext } from "../../context/userContext/UserContext.js";
import api from "../../../api";
import EditarUsuarioStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function EditarPerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

    const nomeMensagem = () => {
    if (nome.length > 0 && nome.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
    if (nome.length > 100) return "O nome não pode ter mais de 100 caracteres.";
    return "";
  };

  const emailMensagem = () => {
    if (email.length > 0 && email.length < 5) return "O email deve ter pelo menos 5 caracteres.";
    if (email.length > 32) return "O email não pode ter mais de 32 caracteres.";
    return "";
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      const payload = {
        nome,
        email,
        senha: novaSenha || null,
        senhaAtual: senhaAntiga || null,
        confirmarSenha: confirmarSenha || null,
      };

      const response = await api.put("/usuario", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log("ERRO AO ATUALIZAR PERFIL:", error.response?.data);

      const mensagem =
        error.response?.data?.mensagem ||
        "Erro ao atualizar perfil";

      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const token = await AsyncStorage.getItem("userToken");
              if (!token) {
                setDeleting(false);
                return Alert.alert("Erro", "Usuário não autenticado.");
              }

              await api.delete("/usuario", {
                headers: { Authorization: `Bearer ${token}` },
              });
              await AsyncStorage.clear();
              setUser(null);

              Alert.alert("Conta excluída", "Sua conta foi removida com sucesso!");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.log("ERRO AO EXCLUIR CONTA:", error.response?.data);
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={Global.containerEditar}>
        <Text style={Global.label}>NOME</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />
                {nomeMensagem() ? <Text style={{ color: "red", marginBottom: 10 }}>{nomeMensagem()}</Text> : null}

        <Text style={Global.label}>E-MAIL</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

                {emailMensagem() ? <Text style={{ color: "red", marginBottom: 10 }}>{emailMensagem()}</Text> : null}

        <Text style={EditarUsuarioStyles.sectionTitle}>ALTERAR SENHA (OPCIONAL)</Text>

        <Text style={Global.label}>SENHA ATUAL</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="DIGITE SUA SENHA ATUAL"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={senhaAntiga}
          onChangeText={setSenhaAntiga}
        />

        <Text style={Global.label}>NOVA SENHA</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="DIGITE A SENHA NOVA"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <Text style={Global.label}>CONFIRMAR NOVA SENHA</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="CONFIRME A SENHA NOVA"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <Button
          title={loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          onPress={handleSave}
          disabled={loading}
          buttonStyle={Global.saveButton}
          titleStyle={Global.saveButtonText}
        />

        <Button
          title={deleting ? "EXCLUINDO..." : "EXCLUIR CONTA"}
          onPress={handleDeleteAccount}
          disabled={deleting}
          buttonStyle={[EditarUsuarioStyles.deleteButton, { backgroundColor: "#ffdddd" }]}
          titleStyle={[EditarUsuarioStyles.deleteButtonText, { color: "#D9534F" }]}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

