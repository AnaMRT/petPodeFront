import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import PlantCard from "../components/PlantCard";

export default function PlantasFavsScreen({ navigation }) {
  const [favoritas, setFavoritas] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [carregando, setCarregando] = useState(true);

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
        await api.put(`/favoritos/${plantaId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritosIds((prev) => [...prev, plantaId]);
        const planta = favoritas.find((p) => p.id === plantaId);
        if (planta && !favoritas.includes(planta)) {
          setFavoritas((prev) => [...prev, planta]);
        }
      } else {
        await api.delete(`/favoritos/${plantaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritosIds((prev) => prev.filter((id) => id !== plantaId));
        setFavoritas((prev) => prev.filter((p) => p.id !== plantaId));
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
    }
  };

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
          data={favoritas}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <PlantCard
              planta={item}
              isFavorite={favoritosIds.includes(item.id)}
              onPress={() => navigation.navigate("DetalhesPlanta", { planta: item })}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
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
});
