import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import { Picker } from '@react-native-picker/picker';
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "react-native-elements";

export default function RegisterScreenPet({ navigation }) {
  const [nome, setNome] = useState("");
  const [value, setValue] = useState(null);

  const handleRegisterPet = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // ✅ CORRIGIDO
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

      Alert.alert("Sucesso", "Pet cadastrado!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error.response?.data || error.message);
    }
  };

  const AbrirHome = () => navigation.navigate("Home");

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>CADASTRE SEU PET</Text>
        <TextInput
          style={styles.input}
          placeholder="NOME"
          value={nome}
          onChangeText={setNome}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={value}
            onValueChange={setValue}
            style={styles.picker}
            prompt="Selecione a espécie"
          >
            <Picker.Item label="Selecione a espécie" value={null} />
            <Picker.Item label="Canino" value="canino" />
            <Picker.Item label="Felino" value="felino" />
          </Picker>
        </View>

        <Button
          buttonStyle={{
            backgroundColor: "#6B4226",
            borderRadius: 20,
            padding: 14,
            marginTop: 10,
            marginBottom: 10,
          }}
          title="CADASTRO"
          onPress={handleRegisterPet}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.pular}>Pular</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor:"#F9F3F6" },
  title: { fontSize: 64, marginBottom: 100, textAlign: "center", fontFamily:"PlayfairDisplay_400Regular", color:"#2C2C2C"},
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, fontFamily:"Nunito_400Regular", color:"#6D6D6D", backgroundColor: "#fff",},
  pickerContainer: {borderWidth: 1, marginBottom: 10, borderRadius: 20, fontFamily:"Nunito_400Regular", color:"#6D6D6D"},
  picker: { fontFamily:"Nunito_400Regular", color:"#6D6D6D" },
  button:{ backgroundColor:"#6B4226", fontFamily:"Nunito_400Regular" },
  pular: { color: "#6B4226", textAlign: "right", textDecorationLine: "underline", fontFamily:"Nunito_400Regular"},
});
