import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
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
    <View style={Global.container}>
      <Text style={ResetSenhaStyles.title}>REDEFINIR SENHA</Text>
      <TextInput
        style={Global.input}
        placeholder="CÓDIGO"
        value={codigo}
        onChangeText={setCodigo}
      />
      <View style={Global.inputSenhaContainer}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="NOVA SENHA"
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
