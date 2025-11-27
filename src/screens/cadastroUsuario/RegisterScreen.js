import React, { useState, useContext } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import api from "../../../api";
import { AuthContext } from "../../context/authContext/AuthContext.js";
import { UserContext } from "../../context/userContext/UserContext.js";
import { PlanoContext } from "../../context/planoContext/PlanoContext.js";
import { Platform } from "react-native";
import CadastroUsuarioStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetarPlano } = useContext(PlanoContext);

  const { login } = useContext(AuthContext);
  const { fetchUser } = useContext(UserContext);

   const nomeMensagem = () => {
    if (nome.length > 0 && nome.length < 2) {
      return "O nome deve ter pelo menos 2 caracteres.";
    }
    if (nome.length > 100) {
      return "O nome não pode ter mais de 100 caracteres.";
    }
    return "";
  };

  const emailMensagem = () => {
    if (email.length > 0 && email.length < 5) {
      return "O email deve ter pelo menos 5 caracteres.";
    }
    if (email.length > 32) {
      return "O email não pode ter mais de 32 caracteres.";
    }
    return "";
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    
    try {
      setLoading(true);

      await api.post("/auth/cadastro", {
        nome,
        email,
        senha,
      });

      const loginResponse = await api.post("/auth/login", {
        email,
        senha,
      });

      const { token } = loginResponse.data;

      await login(token);
      resetarPlano();
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
      <View style={Global.container}>
        <Text style={Global.title}>CADASTRO</Text>

        <TextInput
          style={Global.input}
          placeholder="NOME"
          placeholderTextColor="#6D6D6D"
          value={nome}
          onChangeText={setNome}
        />
  {nomeMensagem() ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{nomeMensagem()}</Text>
      ) : null}

        <TextInput
          style={Global.input}
          placeholder="E-MAIL"
          placeholderTextColor="#6D6D6D"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
         {emailMensagem() ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{emailMensagem()}</Text>
      ) : null}

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

        <Button
          title={loading ? "Cadastrando..." : "CADASTRAR"}
          onPress={handleRegister}
          disabled={loading}
          buttonStyle={CadastroUsuarioStyles.submitButton}
          titleStyle={Global.buttonText}
        />

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={CadastroUsuarioStyles.linkText}>
            Já tem conta? Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
