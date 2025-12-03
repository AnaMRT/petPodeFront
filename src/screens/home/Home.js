import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  View, Alert, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator,
  Keyboard, Modal, Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api";
import ScreenWrapper from "../../components/screenWrapper/ScreenWrapper.js";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../context/userContext/UserContext.js";
import PlantCard from "../../components/plantCard/PlantCard.js";
import { useFocusEffect } from "@react-navigation/native";
import { PlanoContext } from "../../context/planoContext/PlanoContext.js"; 
import HomeStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";
import useApiError from "../../hooks/ApiError/useApiError.js";

export default function HomeScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const { userPhoto } = useContext(UserContext);

  const { isAssinante } = useContext(PlanoContext); 

  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(false);
  const { getErrorMessage } = useApiError();

  useEffect(() => {
    carregarPlantas();
    carregarFavoritos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const carregarPlantas = async () => {
  try {
    setCarregando(true);
    const response = await api.get("/plantas");
    setPlantas(response.data);
  } catch (error) {
    const mensagem = getErrorMessage(error);
    console.error("Erro ao carregar plantas:", mensagem);
    Alert.alert("Erro", mensagem);
  } finally {
    setCarregando(false);
  }
};


  const carregarFavoritos = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return;

    const response = await api.get("/favoritos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFavoritosIds(response.data.map((p) => p.id));
  } catch (error) {
    const mensagem = getErrorMessage(error);
    console.error("Erro ao carregar favoritos:", mensagem);
  }
};



 const buscarPlantas = async () => {
  Keyboard.dismiss();
  if (!busca.trim()) {
    carregarPlantas();
    return;
  }

  try {
    setCarregando(true);
    const token = await AsyncStorage.getItem("userToken");

    const response = await api.get("/plantas/search", {
      params: { termo: busca },
      headers: { Authorization: `Bearer ${token}` },
    });

    setPlantas(response.data);

  } catch (error) {
    const mensagem = getErrorMessage(error);
    console.error("Erro na busca:", mensagem);
    Alert.alert("Erro", mensagem);
  } finally {
    setCarregando(false);
  }
};


  const handleToggleFavorite = async (plantaId, isFavorito) => {

  if (!isAssinante) {
    Alert.alert("Recurso exclusivo", "Assine o plano para favoritar plantas");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("userToken");

    if (isFavorito) {
      await api.put(`/favoritos/${plantaId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritosIds((prev) => [...prev, plantaId]);
    } else {
      await api.delete(`/favoritos/${plantaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));
    }

  } catch (error) {
    const mensagem = getErrorMessage(error);
    console.error("Erro ao atualizar favorito:", mensagem);
    Alert.alert("Erro", mensagem);
  }
};

  const renderItem = ({ item }) => (
    <PlantCard
      planta={item}
      onPress={() => {
        setPlantaSelecionada(item);
        setModalVisible(true);
      }}
      isFavorite={favoritosIds.includes(item.id)}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  const plantasComEspaco = [...plantas];
  if (plantas.length % 2 !== 0) plantasComEspaco.push({ id: "vazio" });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 200);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <ScreenWrapper>
      <View style={HomeStyles.container}>
        <View style={HomeStyles.searchRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={HomeStyles.iconUserContainer}>
            <Image
              source={userPhoto ? { uri: userPhoto } : require("../../../assets/user-placeholder.png")}
              style={HomeStyles.userPhoto}
            />
          </TouchableOpacity>

          <View style={HomeStyles.searchBox}>
            <TextInput
              style={HomeStyles.searchInput}
              placeholder="BUSCAR PLANTAS OU PETS"
              placeholderTextColor="#999"
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={buscarPlantas}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={buscarPlantas} style={HomeStyles.searchIcon}>
              <Ionicons name="search" size={20} color="#6B4226" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={HomeStyles.alerta}>Cuidado: plantas tóxicas para pets!</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#A3B18A" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={plantasComEspaco}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              item.id === "vazio" ? <View style={[Global.cardVazio]} /> : renderItem({ item })
            }
            numColumns={2}
            columnWrapperStyle={HomeStyles.linha}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        )}

        {showButton && (
          <TouchableOpacity style={Global.scrollTopButton} onPress={scrollToTop}>
            <Ionicons name="arrow-up" size={26} color="#fff" />
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={Global.modalContainer}>
            <View style={Global.modalContent}>

              {plantaSelecionada && (
                <>
                  <Image source={{ uri: plantaSelecionada.imagemUrl }} style={Global.imagemGrande} />

                  <TouchableOpacity
                    style={Global.modalStar}
                    onPress={() => {
                      if (!isAssinante) {
                        Alert.alert("Recurso exclusivo", "Assine o plano para favoritar plantas ");
                        return;
                      }

                      handleToggleFavorite(
                        plantaSelecionada.id,
                        !favoritosIds.includes(plantaSelecionada.id)
                      );
                    }}
                  >
                    <Ionicons
                      name={favoritosIds.includes(plantaSelecionada.id) ? "star" : "star-outline"}
                      size={26}
                      color="#FFB200"
                    />
                  </TouchableOpacity>

                  <Text style={Global.nome}>{plantaSelecionada.nomePopular}</Text>
                  <Text style={Global.nomeCientifico}>{plantaSelecionada.nomeCientifico}</Text>
                  <Text style={Global.descricao}>{plantaSelecionada.descricao}</Text>

                  <Text style={Global.toxica}>
                    {plantaSelecionada.toxicaParaCaninos ? "Tóxica para cães\n" : ""}
                    {plantaSelecionada.toxicaParaFelinos ? "Tóxica para gatos" : ""}
                  </Text>

                  <TouchableOpacity onPress={() => setModalVisible(false)} style={Global.botaoFechar}>
                    <Text style={Global.botaoFecharTexto}>FECHAR</Text>
                  </TouchableOpacity>
                </>
              )}

            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}