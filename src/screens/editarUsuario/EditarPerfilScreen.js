import React, { useState, useContext } from "react";
import {
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import { UserContext } from "../../context/userContext/UserContext.js";
import api from "../../../api";
import EditarUsuarioStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";
import useApiError from "../../hooks/ApiError/useApiError.js";

export default function EditarPerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { getErrorMessage } = useApiError();

  const nameMessage = () => {
    if (nome.length > 0 && nome.length < 2)
      return "O nome deve ter pelo menos 2 caracteres.";
    if (nome.length > 100) return "O nome não pode ter mais de 100 caracteres.";
    return "";
  };

  const emailMessage = () => {
    if (email.length > 0 && email.length < 5)
      return "O email deve ter pelo menos 5 caracteres.";
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

      const mensagem = getErrorMessage(error);

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

              Alert.alert(
                "Conta excluída",
                "Sua conta foi removida com sucesso!"
              );
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.log("ERRO AO EXCLUIR CONTA:", error.response?.data);

              const mensagem = getErrorMessage(error);

              Alert.alert("Erro", mensagem);
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
        {nameMessage() ? (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {nameMessage()}
          </Text>
        ) : null}

        <Text style={Global.label}>E-MAIL</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {emailMessage() ? (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {emailMessage()}
          </Text>
        ) : null}

        <Text style={EditarUsuarioStyles.sectionTitle}>
          ALTERAR SENHA (OPCIONAL)
        </Text>

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

        <TouchableOpacity
          style={[Global.saveButton, loading && Global.ButtonLoading]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text
            style={[Global.saveButtonText, loading && Global.ButtonLoadingText]}
          >
            {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            EditarUsuarioStyles.deleteButton,
            deleting && EditarUsuarioStyles.deleteButtonLoading,
          ]}
          onPress={handleDeleteAccount}
          disabled={deleting}
          activeOpacity={0.7}
        >
          <Text
            style={[
              EditarUsuarioStyles.deleteButtonText,
              deleting && EditarUsuarioStyles.deleteButtonLoadingText,
            ]}
          >
            {deleting ? "EXCLUINDO..." : "EXCLUIR CONTA"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}