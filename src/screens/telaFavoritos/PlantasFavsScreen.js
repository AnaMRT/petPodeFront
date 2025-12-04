import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper";
import PlantCard from "../../components/plantCard/PlantCard";
import { Ionicons } from "@expo/vector-icons";
import Global from "../../components/estilos/Styles";
import { PlanoContext } from "../../context/planoContext/PlanoContext";
import useApiError from "../../hooks/ApiError/useApiError.js";

export default function PlantasFavsScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [loading, setloading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantSelected, setPlantSelected] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const flatListRef = useRef(null);
  const { isAssinante } = useContext(PlanoContext);
  const { getErrorMessage } = useApiError();

  const loadFavorites = async () => {
    try {
      setloading(true);
      const token = await AsyncStorage.getItem("userToken");

      const response = await api.get("/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritos(response.data);
      setFavoritosIds(response.data.map((p) => p.id));
    } catch (error) {
      const mensagem = getErrorMessage(error);
      console.error("Erro ao carregar favoritos:", mensagem);
      Alert.alert("Erro", mensagem);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const cancelFavorites = async () => {
      if (!isAssinante) {
        try {
          const token = await AsyncStorage.getItem("userToken");
          for (const planta of favoritos) {
            await api.delete(`/favoritos/${planta.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          setFavoritos([]);
          setFavoritosIds([]);

          console.log("Favoritos removidos após cancelar o plano.");
        } catch (error) {
          const mensagem = getErrorMessage(error);
          console.error("Erro ao limpar favoritos:", mensagem);
        }
      }
    };

    cancelFavorites();
  }, [isAssinante]);

  const handleToggleFavorite = async (plantaId, isFavorito) => {
    if (!isAssinante) {
      Alert.alert(
        "Recurso exclusivo",
        "Este recurso é exclusivo para assinantes"
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (isFavorito) {
        await api.put(`/favoritos/${plantaId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavoritosIds((prev) => [...prev, plantaId]);

        const planta = favoritos.find((p) => p.id === plantaId);
        if (planta) setFavoritos((prev) => [...prev, planta]);
      } else {
        await api.delete(`/favoritos/${plantaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));
        setFavoritos((prev) => prev.filter((p) => p.id !== plantaId));
        setTimeout(() => setModalVisible(false), 100);
      }
    } catch (error) {
      const mensagem = getErrorMessage(error);
      console.error("Erro ao atualizar favorito:", mensagem);
      Alert.alert("Erro", mensagem);
    }
  };

  const renderItem = ({ item }) =>
    item.id === "vazio" ? (
      <View style={Global.cardVazio} />
    ) : (
      <PlantCard
        planta={item}
        onPress={() => {
          setPlantSelected(item);
          setModalVisible(true);
        }}
        isFavorite={favoritosIds.includes(item.id)}
        onToggleFavorite={handleToggleFavorite}
        isAssinante={isAssinante}
      />
    );

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={Global.loadingContainer}>
          <ActivityIndicator size="large" color="#A3B18A" />
          <Text style={Global.loadingText}>Carregando favoritos...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const favoritasComEspaco = [...favoritos];
  if (favoritos.length % 2 !== 0) favoritasComEspaco.push({ id: "vazio" });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 250);
  };

  const scrollToTop = () =>
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

  return (
    <ScreenWrapper>
      <Text style={Global.titulo}>FAVORITOS</Text>

      {favoritos.length === 0 ? (
        <View style={Global.container}>
          <Text style={Global.message}>
            Ops... você ainda não possui plantas favoritadas!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={favoritasComEspaco}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={Global.linha}
            contentContainerStyle={{
              paddingBottom: 30,
              paddingHorizontal: 20,
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

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

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={Global.modalContainer}>
          <View style={Global.modalContent}>
            {plantSelected && (
              <>
                <Image
                  source={{ uri: plantSelected.imagemUrl }}
                  style={Global.imagemGrande}
                />

                <TouchableOpacity
                  style={Global.modalStar}
                  onPress={() =>
                    handleToggleFavorite(
                      plantSelected.id,
                      !favoritosIds.includes(plantSelected.id)
                    )
                  }
                >
                  <Ionicons
                    name={
                      favoritosIds.includes(plantSelected.id)
                        ? "star"
                        : "star-outline"
                    }
                    size={26}
                    color="#FFB200"
                  />
                </TouchableOpacity>

                <Text style={Global.nome}>{plantSelected.nomePopular}</Text>
                <Text style={Global.nomeCientifico}>
                  {plantSelected.nomeCientifico}
                </Text>
                <Text style={Global.descricao}>{plantSelected.descricao}</Text>
                <Text style={Global.toxica}>
                  {plantSelected.toxicaParaCaninos ? "Tóxica para cães\n" : ""}
                  {plantSelected.toxicaParaFelinos ? "Tóxica para gatos" : ""}
                </Text>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={Global.botaoFechar}
                >
                  <Text style={Global.botaoFecharTexto}>FECHAR</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}