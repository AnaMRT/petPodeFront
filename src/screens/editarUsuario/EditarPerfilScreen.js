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
import { color } from "react-native-elements/dist/helpers/index.js";

export default function EditarPerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        error.response?.data?.message ||
        error.response?.data?.error ||
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
        <Text style={Global.label}>Nome</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={Global.label}>E-mail</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={EditarUsuarioStyles.sectionTitle}>Alterar Senha (opcional)</Text>

        <Text style={Global.label}>Senha Atual</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="Digite sua senha atual"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={senhaAntiga}
          onChangeText={setSenhaAntiga}
        />

        <Text style={Global.label}>Nova Senha</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="Digite a nova senha"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <Text style={Global.label}>Confirmar Nova Senha</Text>
        <TextInput
          style={Global.inputEditar}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#6D6D6D"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <Button
          title={loading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleSave}
          disabled={loading}
          buttonStyle={Global.saveButton}
          titleStyle={Global.saveButtonText}
        />

        <Button
          title={deleting ? "Excluindo..." : "Excluir Conta"}
          onPress={handleDeleteAccount}
          disabled={deleting}
          buttonStyle={EditarUsuarioStyles.deleteButton}
          titleStyle={EditarUsuarioStyles.deleteButtonText}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

