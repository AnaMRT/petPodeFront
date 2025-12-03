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
  const [favoritas, setFavoritas] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const flatListRef = useRef(null);
  const { isAssinante } = useContext(PlanoContext);
  const { getErrorMessage } = useApiError();

  const carregarFavoritas = async () => {
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem("userToken");

      const response = await api.get("/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritas(response.data);
      setFavoritosIds(response.data.map((p) => p.id));
    } catch (error) {
      const mensagem = getErrorMessage(error);
      console.error("Erro ao carregar favoritas:", mensagem);
      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarFavoritas);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const cancelarFavoritos = async () => {
      if (!isAssinante) {
        try {
          const token = await AsyncStorage.getItem("userToken");
          for (const planta of favoritas) {
            await api.delete(`/favoritos/${planta.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          setFavoritas([]);
          setFavoritosIds([]);

          console.log("Favoritos removidos após cancelar o plano.");
        } catch (error) {
          const mensagem = getErrorMessage(error);
          console.error("Erro ao limpar favoritas:", mensagem);
        }
      }
    };

    cancelarFavoritos();
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

      const planta = favoritas.find((p) => p.id === plantaId);
      if (planta) setFavoritas((prev) => [...prev, planta]);

    } else {
      await api.delete(`/favoritos/${plantaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));
      setFavoritas((prev) => prev.filter((p) => p.id !== plantaId));
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
          setPlantaSelecionada(item);
          setModalVisible(true);
        }}
        isFavorite={favoritosIds.includes(item.id)}
        onToggleFavorite={handleToggleFavorite}
        isAssinante={isAssinante}
      />
    );

  if (carregando) {
    return (
      <ScreenWrapper>
        <View style={Global.loadingContainer}>
          <ActivityIndicator size="large" color="#A3B18A" />
          <Text style={Global.loadingText}>Carregando favoritas...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const favoritasComEspaco = [...favoritas];
  if (favoritas.length % 2 !== 0) favoritasComEspaco.push({ id: "vazio" });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 250);
  };

  const scrollToTop = () =>
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

  return (
    <ScreenWrapper>
      <Text style={Global.titulo}>FAVORITAS</Text>

      {favoritas.length === 0 ? (
        <View style={Global.container}>
          <Text style={Global.message}>
            Ops... você ainda não possui plantas favoritas!
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
            {plantaSelecionada && (
              <>
                <Image
                  source={{ uri: plantaSelecionada.imagemUrl }}
                  style={Global.imagemGrande}
                />

                <TouchableOpacity
                  style={Global.modalStar}
                  onPress={() =>
                    handleToggleFavorite(
                      plantaSelecionada.id,
                      !favoritosIds.includes(plantaSelecionada.id)
                    )
                  }
                >
                  <Ionicons
                    name={
                      favoritosIds.includes(plantaSelecionada.id)
                        ? "star"
                        : "star-outline"
                    }
                    size={26}
                    color="#FFB200"
                  />
                </TouchableOpacity>

                <Text style={Global.nome}>{plantaSelecionada.nomePopular}</Text>
                <Text style={Global.nomeCientifico}>
                  {plantaSelecionada.nomeCientifico}
                </Text>
                <Text style={Global.descricao}>
                  {plantaSelecionada.descricao}
                </Text>
                <Text style={Global.toxica}>
                  {plantaSelecionada.toxicaParaCaninos
                    ? "Tóxica para cães\n"
                    : ""}
                  {plantaSelecionada.toxicaParaFelinos
                    ? "Tóxica para gatos"
                    : ""}
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
