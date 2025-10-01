import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // importar
import api from "../../api";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/cadastro", { nome, email, senha });
      const token = response.data.token;

      // Salvar token
      await AsyncStorage.setItem("token", token);

      Alert.alert("Sucesso", "Usuário cadastrado!");
      navigation.navigate("Cadastro de Pets");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
