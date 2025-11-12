import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";

export default function EditarPetScreen({ route, navigation }) {
  const { pet } = route.params;
  const [nome, setNome] = useState(pet?.nome || "");
  const [especie, setEspecie] = useState(pet?.especie || "");

  const handleSave = async () => {
    if (!nome.trim()) {
      return Alert.alert("Erro", "O nome do pet é obrigatório.");
    }

    try {
      const token = await AsyncStorage.getItem("userToken"); 
      await api.put(`/pet/${pet.id}`, { nome, especie }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Pet atualizado!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar pet:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Digite o nome do pet"
        />

        <Text style={styles.label}>Espécie</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={especie} onValueChange={setEspecie}>
            <Picker.Item label="Selecione a espécie" value="" />
            <Picker.Item label="Canino" value="canino" />
            <Picker.Item label="Felino" value="felino" />
          </Picker>
        </View>

        <Button title="SALVAR" onPress={handleSave} buttonStyle={styles.saveButton} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9F3F6", flexGrow: 1 },
  label: { marginBottom: 6, color: "#6B4226", fontWeight: "bold", fontSize: 14 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: "#ccc" },
  saveButton: { backgroundColor: "#6B4226", borderRadius: 20, paddingVertical: 14, marginTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 16, backgroundColor: "#fff" },
});
