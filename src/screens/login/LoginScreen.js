import React, { useState, useContext } from "react";
import { Button } from "react-native-elements";
import { View, TextInput, Text, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/authContext/AuthContext.js";
import { Platform } from "react-native";
import LoginStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const token = response.data.token;

      await AsyncStorage.setItem("userToken", token);
      await login(token);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      const mensagemDoBack =
        error.response?.data?.mensagem ||
        error.response?.data ||
        "Erro inesperado.";

      Alert.alert("Erro", mensagemDoBack);
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
        "Enviamos um código para redefinição de senha."
      );

      navigation.navigate("ResetSenha", { email });
    } catch (error) {
      console.log("Erro Android:", error?.response?.data);

      const mensagemDoBack =
        error.response?.data?.mensagem ||
        error.response?.data ||
        "Erro inesperado.";

      Alert.alert("Erro", mensagemDoBack);
    }
  };

  return (
    <ScreenWrapper>
      <View style={Global.container}>
        <Text style={Global.title}>PET {"\n"}PODE?</Text>

        <TextInput
          style={Global.input}
          placeholder="E-MAIL"
          placeholderTextColor="#6D6D6D"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={Global.inputSenhaContainer}>
          <TextInput
            style={{
              flex: 1,
              paddingVertical: Platform.OS === "ios" ? 10 : 6,
              fontFamily: "Nunito_400Regular",
              fontSize: 15,
              color: "#6D6D6D",
            }}
            placeholder="SENHA"
            placeholderTextColor="#6D6D6D"
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

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={LoginStyles.forgot}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <Button
          title="LOGIN"
          onPress={handleLogin}
          buttonStyle={{
            backgroundColor: "#6B4226",
            borderRadius: 20,
            padding: 14,
            marginTop: 10,
            marginBottom: 10,
          }}
          titleStyle={Global.buttonText}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={LoginStyles.flexDirection}
        >
          <Text style={LoginStyles.linhaconta}>Não possui uma conta?</Text>
          <Text style={LoginStyles.cadastro}> Cadastre-se.</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}