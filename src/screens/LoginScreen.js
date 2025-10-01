import React, { useState } from "react";
import { useFonts, PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { Button } from "react-native-elements";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";

  
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);

      Alert.alert("Login OK");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Email ou senha incorretos.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu e-mail primeiro.");
      return;
    }
    try {
      await api.post(`/auth/forgot-password?email=${email}`);
      Alert.alert(
        "Verifique seu e-mail",
        "Enviamos um link para redefinição de senha."
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o e-mail.");
    }
  };

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    Nunito_400Regular
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PET {"\n"}PODE?</Text>
      <TextInput
        style={styles.input}
        placeholder="E-MAIL"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="SENHA"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <Button title="LOGIN" onPress={handleLogin} buttonStyle={{ backgroundColor: "#6B4226", borderRadius: 20, padding: 14, marginTop: 10, marginBottom:10 }} titleStyle={{ fontSize: 18, fontFamily:"Nunito_400Regular" }}/>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")} style={styles.flexDirection}>
        <Text Style={styles.linhaconta}>Não possui uma conta?</Text><Text style={styles.cadastro}>Cadastre-se.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", padding: 20, backgroundColor:"#F9F3F6" },
  title: { fontSize: 64, marginTop: 100, marginBottom: 100, textAlign: "center", fontFamily:"PlayfairDisplay_400Regular", color:"#2C2C2C"},
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, fontFamily:"Nunito_400Regular", color:"#6D6D6D", borderRadius: 20},
  forgot: { color: "#6B4226", textAlign: "right", textDecorationLine: "underline", fontFamily:"Nunito_400Regular"},
  cadastro: { color: "#6B4226", textAlign: "left", textDecorationLine: "underline", fontFamily:"Nunito_400Regular"},
  linhaconta:{marginTop: 2, fontFamily:"Nunito_400Regular"},
  button:{ backgroundColor:"#6B4226", fontFamily:"Nunito_400Regular" },
  flexDirection:{ flexDirection: "row" }
});
