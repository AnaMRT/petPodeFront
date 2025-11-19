import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api";
import PlantCardStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";
import { PlanoContext } from "../../context/planoContext/PlanoContext.js";

export default function PlantCard({ planta, onPress, isFavorite = false, onToggleFavorite }) {
  const [favorito, setFavorito] = useState(isFavorite);

  const { isAssinante } = useContext(PlanoContext);

  useEffect(() => {
    setFavorito(isFavorite);
  }, [isFavorite]);

  const toggleFavorite = async () => {

    if (!isAssinante) {
      Alert.alert(
        "Recurso exclusivo",
        "Assine o plano para favoritar plantas"
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const novoEstado = !favorito;

      if (novoEstado) {
        await api.put(`/favoritos/${planta.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.delete(`/favoritos/${planta.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFavorito(novoEstado);
      if (onToggleFavorite) onToggleFavorite(planta.id, novoEstado);

    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(planta)} style={PlantCardStyles.card}>
      <Image source={{ uri: planta.imagemUrl }} style={PlantCardStyles.imagem} />

      <TouchableOpacity style={PlantCardStyles.favoriteIcon} onPress={toggleFavorite}>
        <Ionicons
          name={favorito ? "star" : "star-outline"}
          size={22}
          color="#F4B400"
        />
      </TouchableOpacity>

      <View style={PlantCardStyles.textBox}>
        <Text style={Global.nomePopular}>{planta.nomePopular}</Text>
        <Text style={Global.nomeCientifico}>{planta.nomeCientifico}</Text>
      </View>
    </TouchableOpacity>
  );
}