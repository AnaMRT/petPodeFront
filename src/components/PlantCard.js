// components/PlantCard.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";

export default function PlantCard({ planta, onPress, isFavorite = false, onToggleFavorite }) {
  const [favorito, setFavorito] = useState(isFavorite);

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!favorito) {
        await api.post(`/favoritos/${planta.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.delete(`/favoritos/${planta.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFavorito(!favorito);
      if (onToggleFavorite) onToggleFavorite(planta.id, !favorito);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(planta)} style={styles.card}>
      <Image source={{ uri: planta.imagemUrl }} style={styles.imagem} />
      <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
        <Ionicons
          name={favorito ? "star" : "star-outline"}
          size={22}
          color="#F4B400"
        />
      </TouchableOpacity>

      <View style={styles.textBox}>
        <Text style={styles.nomePopular}>{planta.nomePopular}</Text>
        <Text style={styles.nomeCientifico}>{planta.nomeCientifico}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A3B18A",
    alignItems: "center",
    marginHorizontal: 5,
    position: "relative",
  },
  imagem: {
    width: "100%",
    height: 150,
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  textBox: {
    paddingVertical: 5,
    alignItems: "center",
  },
  nomePopular: {
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
