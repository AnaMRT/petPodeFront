import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones do Expo
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-elements";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false); // controla a visibilidade da senha

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/cadastro", { nome, email, senha });
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
      Alert.alert("Sucesso", "Usuário cadastrado!");
      navigation.navigate("Cadastro de Pets");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar.");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>CADASTRO</Text>

        <TextInput
          style={styles.input}
          placeholder="NOME"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-MAIL"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={{flex: 1}}
            placeholder="SENHA"
            secureTextEntry={!senhaVisivel} // alterna entre oculto e visível
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons
              name={senhaVisivel ? "eye" : "eye-off"} // ícone de olho
              size={24}
              color="#6B4226"
            />
          </TouchableOpacity>
        </View>

        <Button
          title="CADASTRO"
          onPress={handleRegister}
          buttonStyle={{ backgroundColor: "#6B4226", borderRadius: 20, padding: 14, marginTop: 10, marginBottom: 10 }}
          titleStyle={{ fontSize: 18, fontFamily: "Nunito_400Regular" }}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F3F6" },
  title: { fontSize: 64, marginBottom: 100, textAlign: "center", fontFamily: "PlayfairDisplay_400Regular", color: "#2C2C2C" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, fontFamily: "Nunito_400Regular", color: "#6D6D6D", backgroundColor: "#fff" },
  inputSenhaContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#6B4226", fontFamily: "Nunito_400Regular" },
});
