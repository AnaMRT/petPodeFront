import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 2;

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetImage, setSelectedPetImage] = useState(null);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/pet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      console.error("[fetchPets] Erro:", error);
      Alert.alert("Erro", "Não foi possível carregar seus pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPets);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (petId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await api.delete(`/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prev) => prev.filter((p) => p.id !== petId));
      Alert.alert("Sucesso", "Pet removido com sucesso!");
    } catch (error) {
      console.error("[handleDelete]", error);
      Alert.alert("Erro", "Não foi possível remover o pet.");
    }
  };

  const handleEdit = (pet) => {
    navigation.navigate("EditarPetScreen", { pet });
  };

  const handleChangePhoto = async (pet) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPets((prev) =>
        prev.map((p) => (p.id === pet.id ? { ...p, foto: uri } : p))
      );
    }
  };

  const abrirCadastroPet = () => {
    navigation.navigate("Cadastro de Pets");
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Text style={styles.message}>Carregando seus pets...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text style={styles.titulo}>MEUS PETS</Text>
      <View style={styles.container}>
        {pets.length === 0 ? (
          <>
            <Text style={styles.message}>
              Ops... você ainda não possui pets cadastrados!
            </Text>
            <Button
              title="CADASTRAR PET"
              onPress={abrirCadastroPet}
              buttonStyle={styles.addButton}
              titleStyle={styles.buttonText}
            />
          </>
        ) : (
          <>
            <FlatList
              data={[...pets, { id: "new", isNew: true }]}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
              renderItem={({ item }) =>
                item.isNew ? (
                  <TouchableOpacity
                    onPress={abrirCadastroPet}
                    style={[styles.petCard, styles.addCard]}
                  >
                    <Text style={styles.addText}>＋ Adicionar pet</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.petCard}>
                    <TouchableOpacity
                      onPress={() =>
                        item.foto
                          ? setSelectedPetImage(item.foto)
                          : handleChangePhoto(item)
                      }
                    >
                      <Image
                        source={
                          item.foto
                            ? { uri: item.foto }
                            : require("../../assets/pet-placeholder.png")
                        }
                        style={styles.petImage}
                      />
                    </TouchableOpacity>

                    {/* Ícone de delete */}
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() =>
                        Alert.alert(
                          "Confirmar Exclusão",
                          "Deseja excluir este pet?",
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
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>

                    {/* Ícone de editar */}
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => handleEdit(item)}
                    >
                      <Text style={styles.editText}>✎</Text>
                    </TouchableOpacity>

                    <Text style={styles.petName}>{item.nome}</Text>
                  </View>
                )
              }
            />

            {/* Modal de imagem */}
            <Modal
              visible={!!selectedPetImage}
              transparent
              animationType="fade"
              onRequestClose={() => setSelectedPetImage(null)}
            >
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedPetImage(null)}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: selectedPetImage }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            </Modal>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: "#F9F3F6" },
  titulo:{
    fontSize: 40,
    color:"#2C2C2C",
    textAlign:"center",
    marginBottom: 20,
    fontFamily:"PlayfairDisplay_700Bold"
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
  },
  petCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    borderWidth: 1,
    borderColor: "#A3B18A",
  },
  petImage: {
    width: CARD_SIZE,
    height: CARD_SIZE, 
    backgroundColor:"#C4C4C4",
  },
  petName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B4226",
    textAlign: "center",
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A3B18A",
    backgroundColor: "#fff9f6",
  },
  addText: {
    fontSize: 16,
    color: "#6B4226",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontFamily: "Nunito_400Regular" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "90%", height: "70%" },
  closeButton: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  closeText: { color: "white", fontSize: 28 },
  deleteIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  editIcon: {
    position: "absolute",
    top: 6,
    left: 6, // canto oposto do delete
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  editText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
