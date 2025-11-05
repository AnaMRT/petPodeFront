import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, Image, TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import PlantCard from "../components/PlantCard";
import { Ionicons } from "@expo/vector-icons";

export default function PlantasFavsScreen({ navigation }) {
  const [favoritas, setFavoritas] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);

  const carregarFavoritas = async () => {
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem("token");

      const response = await api.get("/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritas(response.data);
      setFavoritosIds(response.data.map((p) => p.id));
    } catch (error) {
      console.error("Erro ao carregar favoritas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas plantas favoritas.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarFavoritas);
    return unsubscribe;
  }, [navigation]);

  const handleToggleFavorite = async (plantaId, isFavorito) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (isFavorito) {
      // Favoritar
      await api.put(`/favoritos/${plantaId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritosIds((prev) => [...prev, plantaId]);

      const planta = favoritas.find((p) => p.id === plantaId);
      if (planta) {
        setFavoritas((prev) => [...prev, planta]);
      }

    } else {
      // Desfavoritar
      await api.delete(`/favoritos/${plantaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));

      // Remove da lista da tela de favoritos
      setFavoritas((prev) => prev.filter((p) => p.id !== plantaId));

      // Se estiver no modal, fecha com delay pra animação ficar ok
      setTimeout(() => setModalVisible(false), 100);
    }

  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);
    Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
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

  if (carregando) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A3B18A" />
          <Text style={styles.loadingText}>Carregando favoritas...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const favoritasComEspaco = [...favoritas];
  if (favoritas.length % 2 !== 0) {
    favoritasComEspaco.push({ id: "vazio" }); // adiciona item “fantasma” para manter o alinhamento
  }
  return (
    <ScreenWrapper>
      <Text style={styles.titulo}>FAVORITAS</Text>

      {favoritas.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.message}>
            Ops... você ainda não possui plantas favoritas!
          </Text>
        </View>
      ) : (
       <FlatList
                   data={favoritasComEspaco}
                   keyExtractor={(item) => item.id.toString()}
                   renderItem={({ item }) =>
                     item.id === "vazio" ? (
                       <View style={[styles.cardVazio]} />
                     ) : (
                       renderItem({ item })
                     )
                   }
                   numColumns={2}
                   columnWrapperStyle={styles.linha}
                   contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 5 }}
                 />
      )}
       {/* Modal de detalhes */}
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 40,
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F9F3F6",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    textAlign: "center",
  },
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
  cardVazio: {
    flex: 1,
    margin: 5,
    backgroundColor: "transparent",
  },
  linha: {
    justifyContent: "space-between",
    marginBottom: 10,
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
