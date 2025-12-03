import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper";
import api from "../../../api";
import Global from "../../components/estilos/Styles";
import useApiError from "../../hooks/ApiError/useApiError.js";

export default function EditarPetScreen({ route, navigation }) {
  const { pet } = route.params;
  const [nome, setNome] = useState(pet?.nome || "");
  const [especie, setEspecie] = useState(pet?.especie || "");
  const { getErrorMessage } = useApiError();

  const nomeMensagem = () => {
    if (nome.length > 0 && nome.length < 2) {
      return "O nome deve ter pelo menos 2 caracteres.";
    }
    if (nome.length > 100) {
      return "O nome não pode ter mais de 100 caracteres.";
    }
    return "";
  };

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
    const mensagem = getErrorMessage(error);
    Alert.alert("Erro", mensagem);
  }
};


  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={Global.containerEditar}>

        <Text style={Global.label}>NOME</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={Global.inputEditar}
          placeholder="Digite o nome do pet"
          placeholderTextColor="#6D6D6D"
        />
         {nomeMensagem() ? (
                        <Text style={{ color: "red", marginBottom: 10 }}>{nomeMensagem()}</Text>
                      ) : null}

        <Text style={Global.label}>ESPÉCIE</Text>
        <View style={Global.pickerContainer}>
          <Picker selectedValue={especie} onValueChange={setEspecie}>
            <Picker.Item label="Selecione a espécie" value="" />
            <Picker.Item label="Canino" value="canino" />
            <Picker.Item label="Felino" value="felino" />
          </Picker>
        </View>

        <Button title="SALVAR" onPress={handleSave} buttonStyle={Global.saveButton} />
      </ScrollView>
    </ScreenWrapper>
  );
}
