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
  setLoading(true);

  try {
    const token = await AsyncStorage.getItem("token");
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
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Erro ao atualizar perfil";

    Alert.alert("Erro", mensagem);
  } finally {
    setLoading(false);
  }
};

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

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
    marginTop: 50,
    padding: 20,
    backgroundColor: "#F9F3F6",
    flexGrow: 1,
  },
  label: {
    marginBottom: 6,
    color: "#2C2C2C",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
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