import React, { useContext, useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";
import { PetsContext } from "../context/PetsContext";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 2;

export default function PetsScreen({ navigation }) {
  const { pets, setPets } = useContext(PetsContext);
  const [loading, setLoading] = useState(true);
  const [selectedPetImage, setSelectedPetImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Carrega pets do backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/pet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar seus pets.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPets);
    return unsubscribe;
  }, [navigation]);

  // === ✅ NOVA LÓGICA DE UPLOAD DE IMAGEM (ENVIA DIRETO PARA O BACKEND) ===
  const handleChangePhoto = async (pet) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "foto_pet.jpg",
      });

      const response = await api.put(`/pet/${pet.id}/imagem`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const novaUrl = response.data.imagemUrl;

      setPets((prevPets) =>
        prevPets.map((p) => (p.id === pet.id ? { ...p, imagemUrl: novaUrl } : p))
      );

      Alert.alert("Sucesso", "Imagem atualizada!");
    } catch (error) {
      console.log("[ERRO AO ATUALIZAR IMAGEM]", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (petId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await api.delete(`/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prevPets) => prevPets.filter((p) => p.id !== petId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o pet.");
    }
  };

  const abrirCadastroPet = () => navigation.navigate("Cadastro de Pets");
  const abrirEditarPet = (pet) =>
    navigation.navigate("EditarPetScreen", { pet });

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A3B18A" />
          <Text style={styles.loadingText}>Carregando pets...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text style={styles.titulo}>MEUS PETS</Text>

      <View style={styles.container}>
        {pets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.message}>
              Ops... você ainda não possui pets cadastrados!
            </Text>

            <Button
              title="CADASTRAR PET"
              onPress={abrirCadastroPet}
              buttonStyle={styles.addButton}
              titleStyle={styles.buttonText}
            />
          </View>
        ) : (
          <>
            <FlatList
              data={[...pets, { id: "new", isNew: true }]}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 20,
              }}
              renderItem={({ item }) =>
                item.isNew ? (
                  <TouchableOpacity
                    style={[styles.petCard, styles.addCard]}
                    onPress={abrirCadastroPet}
                  >
                    <Text style={styles.addText}>＋ Adicionar pet</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.petCard}>
                    <TouchableOpacity
                      onPress={() =>
                        item.imagemUrl
                          ? setSelectedPetImage(item.imagemUrl)
                          : handleChangePhoto(item)
                      }
                    >
                      <Image
                        source={
                          item.imagemUrl
                            ? { uri: item.imagemUrl }
                            : require("../../assets/pet-placeholder.png")
                        }
                        style={styles.petImage}
                      />
                    </TouchableOpacity>

                    {/* DELETE */}
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

                    {/* EDITAR */}
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => abrirEditarPet(item)}
                    >
                      <Text style={styles.editText}>✎</Text>
                    </TouchableOpacity>

                    <Text style={styles.petName}>{item.nome}</Text>
                  </View>
                )
              }
            />

            {/* Modal de visualização da imagem */}
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

            {uploading && (
              <ActivityIndicator
                size="large"
                color="#6B4226"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginLeft: -12,
                  marginTop: -12,
                }}
              />
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F9F3F6",
  },
  titulo: {
    fontSize: 40,
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
    backgroundColor: "#C4C4C4",
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
  addText: { fontSize: 16, color: "#6B4226", fontWeight: "bold" },
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
    left: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  editText: { color: "white", fontWeight: "bold", fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    marginTop: 10,
  },
});