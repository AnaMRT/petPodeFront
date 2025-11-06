import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Image, ActivityIndicator, Keyboard, Modal, StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import PlantCard from "../components/PlantCard";
import { useFocusEffect } from "@react-navigation/native"; // ✅ IMPORTADO

export default function HomeScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const { userPhoto } = useContext(UserContext);

  useEffect(() => {
    carregarPlantas();
    carregarFavoritos();
  }, []);

  // ✅ Recarregar favoritos quando voltar pra Home
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
      console.error("Erro ao carregar plantas:", error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
 const token = await AsyncStorage.getItem("userToken"); 
       const response = await api.get("/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritosIds(response.data.map((p) => p.id));
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
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
      console.error("Erro na busca:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleToggleFavorite = async (plantaId, isFavorito) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (isFavorito) {
        await api.put(`/favoritos/${plantaId}`, null, { headers: { Authorization: `Bearer ${token}` } });
        setFavoritosIds((prev) => [...prev, plantaId]);
      } else {
        await api.delete(`/favoritos/${plantaId}`, { headers: { Authorization: `Bearer ${token}` } });
        setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
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
  if (plantas.length % 2 !== 0) {
    plantasComEspaco.push({ id: "vazio" });
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Barra de busca e foto do usuário */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconUserContainer}>
            <Image
              source={userPhoto ? { uri: userPhoto } : require("../../assets/user-placeholder.png")}
              style={styles.userPhoto}
            />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="BUSCAR PLANTAS"
              placeholderTextColor="#999"
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={buscarPlantas}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={buscarPlantas} style={styles.searchIcon}>
              <Ionicons name="search" size={20} color="#6B4226" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.alerta}>Cuidado: plantas tóxicas para seus pets!</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#A3B18A" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={plantasComEspaco}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              item.id === "vazio" ? <View style={[styles.cardVazio]} /> : renderItem({ item })
            }
            numColumns={2}
            columnWrapperStyle={styles.linha}
            contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 5 }}
          />
        )}

        {/* Modal */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {plantaSelecionada && (
                <>
                  <Image source={{ uri: plantaSelecionada.imagemUrl }} style={styles.imagemGrande} />
                  <TouchableOpacity
                    style={styles.modalStar}
                    onPress={() =>
                      handleToggleFavorite(
                        plantaSelecionada.id,
                        !favoritosIds.includes(plantaSelecionada.id)
                      )
                    }
                  >
                    <Ionicons
                      name={favoritosIds.includes(plantaSelecionada.id) ? "star" : "star-outline"}
                      size={26}
                      color="#FFB200"
                    />
                  </TouchableOpacity>

                  <Text style={styles.nome}>{plantaSelecionada.nomePopular}</Text>
                  <Text style={styles.nomeCientifico}>{plantaSelecionada.nomeCientifico}</Text>
                  <Text style={styles.descricao}>{plantaSelecionada.descricao}</Text>
                  <Text style={styles.toxica}>
                    {plantaSelecionada.toxicaParaCaninos ? "Tóxica para cães\n" : ""}
                    {plantaSelecionada.toxicaParaFelinos ? "Tóxica para gatos" : ""}
                  </Text>

                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botaoFechar}>
                    <Text style={styles.botaoFecharTexto}>FECHAR</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9F3F6" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  iconUserContainer: {
    paddingRight: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6B4226",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2C2C2C",
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#6D6D6D",
    fontFamily: "Nunito_400Regular",
  },
  searchIcon: {
    paddingLeft: 10,
  },

  alerta: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: "Nunito_700Bold",
  },

  linha: {
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardVazio: {
    flex: 1,
    margin: 5,
    backgroundColor: "transparent",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    position: "relative",
  },
  modalStar: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 5,
  },
  imagemGrande: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "#2C2C2C",
    fontFamily: "Nunito_400Regular",
  },
  toxica: {
    fontSize: 14,
    color: "#D9534F",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Nunito_700Bold",
  },
  botaoFechar: {
    marginTop: 15,
    backgroundColor: "#6B4226",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  botaoFecharTexto: {
    color: "#fff",
    fontFamily: "Nunito_700Bold",
  },
  nome: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    textAlign: "center",
    color: "#2C2C2C",
    textTransform: "uppercase",
  },
  nomeCientifico: {
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "Nunito_400Regular",
    color: "#6D6D6D",
    textAlign: "center",
    marginTop: 2,
  },
});
