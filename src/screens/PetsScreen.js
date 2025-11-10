import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import api from "../../api";
import { PetsContext } from "../context/PetsContext";
import PhotoPickerModalPet from "../components/PhotoPickerModalPet";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 2;

export default function PetsScreen({ navigation }) {
  const { pets, setPets } = useContext(PetsContext);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);

  // Novo: controle do scroll
  const [showButton, setShowButton] = useState(false);
  const flatListRef = useRef(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
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

  const abrirModalFotoPet = (pet) => {
    setPetSelecionado(pet);
    setModalVisible(true);
  };

  const escolherDaGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && petSelecionado) {
      setModalVisible(false);
      await handleChangePhoto(petSelecionado, result.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão da câmera negada.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && petSelecionado) {
      setModalVisible(false);
      await handleChangePhoto(petSelecionado, result.assets[0].uri);
    }
  };

  const handleChangePhoto = async (pet, uri) => {
    try {
      setUploading(true);
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("file", {
        uri,
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
        prevPets.map((p) =>
          p.id === pet.id ? { ...p, imagemUrl: novaUrl } : p
        )
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
      const token = await AsyncStorage.getItem("userToken");
      await api.delete(`/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prevPets) => prevPets.filter((p) => p.id !== petId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o pet.");
    }
  };

  const abrirCadastroPet = () => navigation.navigate("Cadastro de Pets");
  const abrirEditarPet = (pet) =>navigation.navigate("EditarPetScreen", { pet });

  // Funções do botão de scroll
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 200);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

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
              ref={flatListRef}
              data={[...pets, { id: "new", isNew: true }]}
              keyExtractor={(item) => item.id.toString()}
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
                    <TouchableOpacity onPress={() => abrirModalFotoPet(item)}>
                      <Image
                        source={
                          item.imagemUrl
                            ? { uri: item.imagemUrl }
                            : require("../../assets/pet-placeholder.png")
                        }
                        style={styles.petImage}
                      />
                    </TouchableOpacity>

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
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={20}
                        color="#FFF"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => abrirEditarPet(item)}
                    >
                      <Feather name="edit-2" size={20} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.petName}>{item.nome}</Text>
                  </View>
                )
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 30 }}
            />

            {/* Modal de troca de foto */}
            <PhotoPickerModalPet
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onPickGallery={escolherDaGaleria}
              onPickCamera={tirarFoto}
            />

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

            {/* Botão flutuante para subir */}
            {showButton && (
              <TouchableOpacity
                style={styles.scrollTopButton}
                onPress={scrollToTop}
              >
                <Ionicons name="arrow-up" size={26} color="#fff" />
              </TouchableOpacity>
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
    borderRadius: 6,
  },
  petImage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#C4C4C4",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    marginTop: 10,
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 45,
    right: 25,
    backgroundColor: "#A3B18A",
    padding: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
