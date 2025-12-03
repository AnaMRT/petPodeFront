import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import api from "../../../api.js";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import ResetSenhaStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function ResetSenhaScreen({ route, navigation }) {
  const email = route?.params?.email || "";

  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

 const handleResetSenha = async () => {
  if (!codigo || !novaSenha) {
    Alert.alert("Erro", "Preencha todos os campos.");
    return;
  }

  try {
    const response = await api.post("/auth/reset-password", {
      email,
      codigo,
      novaSenha,
    });

    const mensagemDoBack = response.data?.mensagem || "Senha redefinida com sucesso.";
    Alert.alert("Sucesso", mensagemDoBack);
    navigation.navigate("Login");

  } catch (error) {
    console.log(error.response?.data || error.message);
    const mensagemErro =
      error.response?.data?.mensagem ||
      error.response?.data?.message ||
      "Código inválido ou expirado.";

    Alert.alert("Erro", mensagemErro);
  }
};

  return (
    <View style={Global.container}>
      <Text style={ResetSenhaStyles.title}>REDEFINIR SENHA</Text>

      <TextInput
        style={Global.input}
        placeholder="CÓDIGO"
        placeholderTextColor="#6D6D6D"
        value={codigo}
        onChangeText={setCodigo}
        keyboardType="numeric"
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
          placeholder="NOVA SENHA"
          placeholderTextColor="#6D6D6D"
          secureTextEntry={!senhaVisivel}
          value={novaSenha}
          onChangeText={setNovaSenha}
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
        title="REDEFINIR SENHA"
        onPress={handleResetSenha}
        buttonStyle={{
          backgroundColor: "#6B4226",
          borderRadius: 20,
          padding: 14,
          marginTop: 10,
          marginBottom: 10,
        }}
        titleStyle={{ fontSize: 18, fontFamily: "Nunito_400Regular" }}
      />
    </View>
  );
}