import React, { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api";
import { Picker } from "@react-native-picker/picker";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import { Button } from "react-native-elements";
import CadastroPetStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function RegisterScreenPet({ navigation }) {
  const [nome, setNome] = useState("");
  const [value, setValue] = useState(null);

   const nomeMensagem = () => {
    if (nome.length > 0 && nome.length < 2) {
      return "O nome deve ter pelo menos 2 caracteres.";
    }
    if (nome.length > 100) {
      return "O nome não pode ter mais de 100 caracteres.";
    }
    return "";
  };

  const handleRegisterPet = async () => {
    if (!nome.trim() || !value) {
      Alert.alert("Atenção", "Por favor, preencha o nome e selecione a espécie do pet.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado");
        navigation.navigate("Login");
        return;
      }

      await api.post(
        "/pet",
        { nome, especie: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error.response?.data || error.message);
    }
  };

  const handleSkip = () => navigation.navigate("Home");

  return (
    <ScreenWrapper>
      <View style={Global.container}>
        <Text style={Global.title}>CADASTRE SEU PET</Text>

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

        <View style={Global.pickerContainer}>
          <Picker
            selectedValue={value}
            onValueChange={setValue}
            style={Global.picker}
            prompt="Selecione a espécie"
          >
            <Picker.Item label="Selecione a espécie" value={null} />
            <Picker.Item label="Canino" value="canino" />
            <Picker.Item label="Felino" value="felino" />
          </Picker>
        </View>

        <Button
          buttonStyle={CadastroPetStyles.buttonCadastro}
          title="CADASTRO"
          onPress={handleRegisterPet}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={handleSkip}>
          <Text style={CadastroPetStyles.pular}>Pular</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}