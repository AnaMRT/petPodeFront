import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Modal,
  Animated,
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
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantSelected, setPlantSelected] = useState(null);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const { userPhoto } = useContext(UserContext);

  const { isAssinante } = useContext(PlanoContext);

  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(false);
  const { getErrorMessage } = useApiError();

  useEffect(() => {
    loadPlants();
    loadFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadPlants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/plantas");
      setPlants(response.data);
    } catch (error) {
      const mensagem = getErrorMessage(error);
      console.error("Erro ao carregar plantas:", mensagem);
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
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

  const searchPlants = async () => {
    Keyboard.dismiss();
    if (!search.trim()) {
      loadPlants();
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const response = await api.get("/plantas/search", {
        params: { termo: search },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlants(response.data);
    } catch (error) {
      const mensagem = getErrorMessage(error);
      console.error("Erro na busca:", mensagem);
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
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
        setPlantSelected(item);
        setModalVisible(true);
      }}
      isFavorite={favoritosIds.includes(item.id)}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  const plantsWithSpace = [...plants];
  if (plants.length % 2 !== 0) plantsWithSpace.push({ id: "vazio" });

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
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={HomeStyles.iconUserContainer}
          >
            <Image
              source={
                userPhoto
                  ? { uri: userPhoto }
                  : require("../../../assets/user-placeholder.png")
              }
              style={HomeStyles.userPhoto}
            />
          </TouchableOpacity>

          <View style={HomeStyles.searchBox}>
            <TextInput
              style={HomeStyles.searchInput}
              placeholder="BUSCAR PLANTAS OU PETS"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={searchPlants}
              returnKeyType="search"
            />
            <TouchableOpacity
              onPress={searchPlants}
              style={HomeStyles.searchIcon}
            >
              <Ionicons name="search" size={20} color="#6B4226" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={HomeStyles.alerta}>
          Cuidado: plantas tóxicas para pets!
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#A3B18A"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={plantsWithSpace}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              item.id === "vazio" ? (
                <View style={[Global.cardVazio]} />
              ) : (
                renderItem({ item })
              )
            }
            numColumns={2}
            columnWrapperStyle={HomeStyles.linha}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
                    onPress={() => {
                      if (!isAssinante) {
                        Alert.alert(
                          "Recurso exclusivo",
                          "Assine o plano para favoritar plantas "
                        );
                        return;
                      }

                      handleToggleFavorite(
                        plantSelected.id,
                        !favoritosIds.includes(plantSelected.id)
                      );
                    }}
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
                  <Text style={Global.descricao}>
                    {plantSelected.descricao}
                  </Text>

                  <Text style={Global.toxica}>
                    {plantSelected.toxicaParaCaninos
                      ? "Tóxica para cães\n"
                      : ""}
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
      </View>
    </ScreenWrapper>
  );
}