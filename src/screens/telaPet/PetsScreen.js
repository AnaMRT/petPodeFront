import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
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
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import api from "../../../api";
import { PetsContext } from "../../context/petsContext/PetsContext.js";
import PhotoPickerModalPet from "../../components/photoPickerPet/PhotoPickerModalPet.js";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import PetStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 2;

export default function PetsScreen({ navigation }) {
  const { pets, setPets } = useContext(PetsContext);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);
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
        <View style={Global.loadingContainer}>
          <ActivityIndicator size="large" color="#A3B18A" />
          <Text style={Global.loadingText}>Carregando pets...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text style={Global.titulo}>MEUS PETS</Text>
      <View style={Global.container}>
        {pets.length === 0 ? (
          <View style={PetStyles.emptyContainer}>
            <Text style={Global.message}>
              Ops... você ainda não possui pets cadastrados!
            </Text>
            <Button
              title="CADASTRAR PET"
              onPress={abrirCadastroPet}
              buttonStyle={PetStyles.addButton}
              titleStyle={PetStyles.buttonText}
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
                    style={[PetStyles.petCard, PetStyles.addCard]}
                    onPress={abrirCadastroPet}
                  >
                    <Text style={PetStyles.addText}>＋ Adicionar pet</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={PetStyles.petCard}>
                    <TouchableOpacity onPress={() => abrirModalFotoPet(item)}>
                      <Image
                        source={
                          item.imagemUrl
                            ? { uri: item.imagemUrl }
                            : require("../../../assets/pet-placeholder.png")
                        }
                        style={PetStyles.petImage}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={PetStyles.deleteIcon}
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
                      style={PetStyles.editIcon}
                      onPress={() => abrirEditarPet(item)}
                    >
                      <Feather name="edit-2" size={20} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={PetStyles.petName}>{item.nome}</Text>
                  </View>
                )
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 30 }}
            />

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

            {showButton && (
              <TouchableOpacity
                style={Global.scrollTopButton}
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