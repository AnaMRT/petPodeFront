import React, { useState, useContext } from "react"; // 👈 corrigido
import { useFonts } from "expo-font";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
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
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext"; // 👈 IMPORTANTE

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
      Alert.alert("Login OK");
      navigation.navigate("Home");
      await login(token); 

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
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
      Alert.alert("Verifique seu e-mail", "Enviamos um código para redefinição de senha.");
      navigation.navigate("ResetSenha", { email });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o e-mail.");
    }
  };

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  if (!fontsLoaded) return null;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>PET {"\n"}PODE?</Text>

        <TextInput
          style={styles.input}
          placeholder="E-MAIL"
          value={email}
          onChangeText={setEmail}
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

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
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
          titleStyle={{ fontSize: 18, fontFamily: "Nunito_400Regular" }}
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
  forgot: { color: "#6B4226", textAlign: "right", textDecorationLine: "underline", fontFamily: "Nunito_400Regular" },
  cadastro: { color: "#6B4226", textAlign: "left", textDecorationLine: "underline", fontFamily: "Nunito_400Regular" },
  linhaconta: { marginTop: 2, fontFamily: "Nunito_400Regular" },
  flexDirection: { flexDirection: "row" },
});