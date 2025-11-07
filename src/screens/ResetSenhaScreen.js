import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../api";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={styles.container}>
      <Text style={styles.title}>REDEFINIR SENHA</Text>
      <TextInput
        style={styles.input}
        placeholder="CÓDIGO"
        value={codigo}
        onChangeText={setCodigo}
      />
      <View style={styles.inputSenhaContainer}>
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F3F6" },
  title: { fontSize: 64, marginBottom: 100, marginTop: -100, textAlign: "center", fontFamily: "PlayfairDisplay_400Regular", color: "#2C2C2C" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, fontFamily: "Nunito_400Regular", color: "#6D6D6D", backgroundColor: "#fff" },
   inputSenhaContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, marginBottom: 10, backgroundColor: "#fff" },
});
