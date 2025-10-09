import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../../api";

export default function ResetSenhaScreen({ route, navigation }) {
const email = route?.params?.email || "";

  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const handleResetSenha = async () => {
    if (!codigo || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        codigo: codigo,
        novaSenha: novaSenha,
      });

      Alert.alert("Sucesso", "Senha redefinida com sucesso.");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Código inválido ou expirado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <Text style={styles.label}>Código recebido no e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Código"
        value={codigo}
        onChangeText={setCodigo}
      />
      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />
      <Button title="Redefinir Senha" onPress={handleResetSenha} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  label: { marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
