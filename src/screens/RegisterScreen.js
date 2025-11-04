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
import { Button } from "react-native-elements";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { fetchUser } = useContext(UserContext);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/cadastro", {
        nome,
        email,
        senha,
      });

      const token = response.data.token;

      await login(token);

      await fetchUser(token);

      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso! Agora você pode adicionar sua foto no perfil."
      );

      navigation.navigate("Cadastro de Pets");

    } catch (error) {
      console.error(" Erro no cadastro:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível cadastrar o usuário.");
    } finally {
      setLoading(false);
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
          keyboardType="email-address"
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
          title={loading ? "Cadastrando..." : "CADASTRAR"}
          onPress={handleRegister}
          disabled={loading}
          buttonStyle={styles.submitButton}
          titleStyle={{ fontSize: 18, fontFamily: "Nunito_400Regular" }}
        />

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F3F6" },
  title: {
    fontSize: 64,
    marginBottom: 100,
    textAlign: "center",
    fontFamily: "PlayfairDisplay_400Regular",
    color: "#2C2C2C",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    fontFamily: "Nunito_400Regular",
    color: "#6D6D6D",
    backgroundColor: "#fff",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  linkText: {
    color: "#6B4226",
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Nunito_400Regular",
  },
});