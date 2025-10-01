import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreenPet({ navigation }) {
  const [nome, setNome] = useState("");
  const [value, setValue] = useState(null);

  const handleRegisterPet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

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

  const AbrirHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
          style={styles.picker}
          prompt="Selecione a espécie"
        >
          <Picker.Item label="Selecione a espécie" value={null} />
          <Picker.Item label="Canino" value="canino" />
          <Picker.Item label="Felino" value="felino" />
        </Picker>
      </View>

      <Button title="Cadastrar" onPress={handleRegisterPet} />

       <TouchableOpacity activeOpacity={0.7} onPress={AbrirHome}>
              <Text>Pular.</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
