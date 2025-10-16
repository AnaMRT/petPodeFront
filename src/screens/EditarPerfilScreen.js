import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/UserContext";

export default function EditarPerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome && !email && !novaSenha) {
      return Alert.alert("Aviso", "Nenhum campo foi alterado.");
    }

    // Validação da senha
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
      const token = await AsyncStorage.getItem("token"); // JWT salvo no login
      if (!token) {
        setLoading(false);
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      const payload = {};
      if (nome !== user?.nome) payload.nome = nome;
      if (email !== user?.email) payload.email = email;
      if (novaSenha) payload.senha = novaSenha;

      console.log("Payload enviado:", payload);

      const response = await fetch("http://SEU_IP:8080/usuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", errorText);
        throw new Error("Falha ao atualizar perfil");
      }

      const usuarioAtualizado = await response.json();
      setUser(usuarioAtualizado);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("[EditarPerfil] Erro:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F3F6",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6B4226",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    color: "#6B4226",
    marginBottom: 6,
    fontWeight: "600",
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
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6B4226",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});