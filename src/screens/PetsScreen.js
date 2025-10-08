import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "react-native-elements";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("[fetchPets] Token:", token);

      const response = await api.get("/pet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[fetchPets] Pets recebidos:", response.data);
      setPets(response.data);
    } catch (error) {
      console.error("[fetchPets] Erro ao buscar pets:", error);
      Alert.alert("Erro", "Não foi possível carregar seus pets.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId) => {
    try {
      console.log("[handleDelete] PetId para deletar:", petId);
      const token = await AsyncStorage.getItem("token");

      await api.delete(`/pet/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPets(pets.filter((pet) => pet.id !== petId));
      Alert.alert("Sucesso", "Pet removido com sucesso!");
    } catch (error) {
      console.error("[handleDelete] Erro ao deletar pet:", error.response || error);
      Alert.alert("Erro", "Não foi possível remover o pet.");
    }
  };

  const handleEdit = (pet) => {
    console.log("[handleEdit] Pet para editar:", pet);
    navigation.navigate("EditarPet", { pet });
  };

  const abrirCadastroPet = () => {
    navigation.navigate("Cadastro de Pets");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPets);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <ScreenWrapper>
        <Text style={styles.message}>Carregando seus pets...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {pets.length === 0 ? (
          <>
            <Text style={styles.message}>
              Ops... você ainda não possui pets cadastrados!
            </Text>
            <Button
              title="CADASTRAR PET"
              onPress={abrirCadastroPet}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </>
        ) : (
          <>
            <FlatList
              data={pets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.petCard}>
                  <Text style={styles.petName}>{item.nome}</Text>
                  <Text style={styles.petInfo}>Espécie: {item.especie}</Text>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => handleEdit(item)}
                      style={styles.editButton}
                    >
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Confirmar Exclusão",
                          "Tem certeza que deseja excluir este pet?",
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Excluir",
                              style: "destructive",
                              onPress: () => handleDelete(item.id),
                            },
                          ]
                        )
                      }
                      style={styles.deleteButton}
                    >
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <Button
              title="CADASTRAR NOVO PET"
              onPress={abrirCadastroPet}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#F9F3F6",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Nunito_400Regular",
    color: "white",
  },
  petCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
  },
  petInfo: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#A67B5B",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});

export default PetsScreen;