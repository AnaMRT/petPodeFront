// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-elements";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);
      await login(token);

      Alert.alert("Login OK");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert("Erro", "Email ou senha incorretos.");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>PET {"\n"}PODE?</Text>

        <TextInput
          style={styles.input}
          placeholder="E-MAIL"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="SENHA"
            secureTextEntry={!senhaVisivel}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons
              name={senhaVisivel ? "eye" : "eye-off"}
              size={24}
              color="#6B4226"
            />
          </TouchableOpacity>
        </View>

        <Button
          title="LOGIN"
          onPress={handleLogin}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={styles.flexDirection}
        >
          <Text style={styles.linhaconta}>Não possui uma conta?</Text>
          <Text style={styles.cadastro}> Cadastre-se.</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F3F6" },
  title: { fontSize: 64, marginBottom: 100, textAlign: "center", fontFamily: "PlayfairDisplay_400Regular", color: "#2C2C2C" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, fontFamily: "Nunito_400Regular", color: "#6D6D6D", backgroundColor: "#fff" },
  inputSenhaContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#6B4226", borderRadius: 20, padding: 14, marginTop: 10, marginBottom: 10 },
  buttonText: { fontSize: 18, fontFamily: "Nunito_400Regular" },
  linhaconta: { marginTop: 2, fontFamily: "Nunito_400Regular" },
  cadastro: { color: "#6B4226", textAlign: "left", textDecorationLine: "underline", fontFamily: "Nunito_400Regular" },
  flexDirection: { flexDirection: "row" },
});
