import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "react-native-elements";


export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
        <TextInput style={styles.input} placeholder="NOME" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="E-MAIL" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="SENHA" secureTextEntry value={senha} onChangeText={setSenha} />
        <Button  buttonStyle={{ backgroundColor: "#6B4226", borderRadius: 20, padding: 14, marginTop: 10, marginBottom:10 }} title="CADASTRO" onPress={handleRegister} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {  flex: 1, justifyContent: "center", padding: 20, backgroundColor:"#F9F3F6" },
  title: { fontSize: 64, marginBottom: 100, textAlign: "center", fontFamily:"PlayfairDisplay_400Regular", color:"#2C2C2C" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, fontFamily:"Nunito_400Regular", color:"#6D6D6D" },
  button:{ backgroundColor:"#6B4226", fontFamily:"Nunito_400Regular" },
});
