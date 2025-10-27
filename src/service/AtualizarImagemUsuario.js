// src/services/usuarioService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";

export const atualizarImagemUsuario = async (localUri) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: "image/jpeg",
    name: "foto.jpg",
  });

  try {
    const response = await api.put("/usuario/imagem", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.imagemUrl; // backend retorna isso
  } catch (error) {
    console.error("Erro ao enviar imagem:", error.response?.data || error.message);
    throw new Error("Falha ao atualizar imagem");
  }
};
