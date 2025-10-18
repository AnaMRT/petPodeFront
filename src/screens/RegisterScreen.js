import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";
import { UserContext } from "../context/UserContext";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [imagem, setImagem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { setUserPhoto } = useContext(UserContext);

  // Função para abrir galeria e selecionar imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImagem(result.uri);
    }
  };

  // Função para fazer upload da imagem no Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imagem) return null;

    const data = new FormData();
    data.append("file", {
      uri: imagem,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", "unsigned_preset"); // seu preset Cloudinary

    try {
      setUploading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dovcmli9p/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const json = await response.json();
      setUploading(false);

      if (json.secure_url) {
        return json.secure_url;
      } else {
        Alert.alert("Erro", "Não foi possível fazer upload da imagem.");
        return null;
      }
    } catch (error) {
      setUploading(false);
      Alert.alert("Erro", "Falha no upload da imagem.");
      return null;
    }
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      // Upload da imagem (se houver)
      const imagemUrl = await uploadImageToCloudinary();

      // Cadastro do usuário
      const response = await api.post("/auth/cadastro", { nome, email, senha });
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);

      // Atualiza a imagem do usuário no backend (se tiver imagem)
      if (imagemUrl) {
        await api.put(
          "/imagem",
          null,
          {
            params: { imagemUrl },
            headers: { Authorization: "Bearer " + token },
          }
        );

        // Salva a imagem no contexto e AsyncStorage (pra persistir)
        setUserPhoto(imagemUrl);
        await AsyncStorage.setItem("userPhoto", imagemUrl);
      }

      Alert.alert("Sucesso", "Usuário cadastrado!");
      navigation.navigate("Cadastro de Pets");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
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

        {/* Botão para escolher imagem */}
        <Button
          title={imagem ? "Alterar Imagem" : "Selecionar Imagem"}
          onPress={pickImage}
          buttonStyle={{
            backgroundColor: "#6B4226",
            borderRadius: 20,
            padding: 14,
            marginBottom: 10,
          }}
        />

        {/* Preview da imagem selecionada */}
        {imagem && (
          <Image
            source={{ uri: imagem }}
            style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 10 }}
          />
        )}

        {/* Loader no upload */}
        {uploading && <ActivityIndicator size="large" color="#6B4226" />}

        <Button
          title="CADASTRAR"
          onPress={handleRegister}
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F3F6",
  },
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
});
