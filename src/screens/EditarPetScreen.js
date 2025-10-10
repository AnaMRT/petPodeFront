import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";

export default function EditarPetScreen({ route, navigation }) {
  const { pet } = route.params;
  const [nome, setNome] = useState(pet.nome);
  const [especie, setEspecie] = useState(pet.especie || "");


  const handleSave = async () => {
    if (!nome.trim()) {
      return Alert.alert("Erro", "O nome do pet é obrigatório.");
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        nome,
        especie,
      };

      await api.put(`/pet/${pet.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Pet atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("[handleSave] Erro:", error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Pet</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Digite o nome do pet"
        />

        <Text style={styles.label}>Espécie</Text>
        <TextInput
          value={especie}
          onChangeText={setEspecie}
          style={styles.input}
          placeholder="Ex.: Cachorro, Gato"
        />
        <Button
          title="SALVAR"
          onPress={handleSave}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F3F6",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B4226",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: "#6B4226",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
