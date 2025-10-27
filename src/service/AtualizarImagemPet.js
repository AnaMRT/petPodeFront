// src/service/atualizarImagemPet.js
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const atualizarImagemPet = async (petId, fileUri) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: "pet.jpg",
      type: "image/jpeg",
    });

    const response = await api.put(`/pet/${petId}/imagem`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.imagemUrl;
  } catch (error) {
    console.error("Erro ao enviar imagem:", error.response?.data || error.message);
    throw error;
  }
};
