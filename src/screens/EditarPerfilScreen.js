import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import { UserContext } from "../context/UserContext";
import api from "../../api";

export default function EditarPerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome && !email && !novaSenha) {
      return Alert.alert("Aviso", "Nenhum campo foi alterado.");
    }

    if (novaSenha || confirmarSenha) {
      if (!senhaAntiga) {
        return Alert.alert("Erro", "Digite sua senha atual para alterá-la.");
      }
      if (novaSenha !== confirmarSenha) {
        return Alert.alert("Erro", "As novas senhas não coincidem.");
      }
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      const payload = {};
      if (nome !== user?.nome) payload.nome = nome;
      if (email !== user?.email) payload.email = email;
      if (novaSenha) {
        payload.senha = novaSenha;
        payload.senhaAtual = senhaAntiga; 
      }

      console.log("[EditarPerfilScreen] Payload enviado:", payload);

      const response = await api.put("/usuario", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(
        "[EditarPerfilScreen] Erro ao atualizar perfil:",
        error.response?.data || error.message || error
      );
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.sectionTitle}>Alterar Senha (opcional)</Text>

        <Text style={styles.label}>Senha Atual</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha atual"
          secureTextEntry
          value={senhaAntiga}
          onChangeText={setSenhaAntiga}
        />

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a nova senha"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <Text style={styles.label}>Confirmar Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme a nova senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <Button
          title={loading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleSave}
          disabled={loading}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F3F6",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6B4226",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    marginBottom: 6,
    color: "#6B4226",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#6B4226",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A3B18A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});