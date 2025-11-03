import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import api from "../../api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Dados do usuário
  const [userPhoto, setUserPhoto] = useState(null);
  const { user: authUser, loading } = useContext(AuthContext);

  // Função para carregar usuário do backend
  const fetchUser = async (token) => {
    if (!token) return;

    try {
      console.log("➡️ Buscando usuário logado com token:", token);
      const response = await api.get("/usuario/logado", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      console.log("✅ Usuário carregado:", userData);

      setUser(userData);
      setUserPhoto(userData.imagemUrl || null);

      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (error) {
      console.log(
        "❌ Erro ao carregar usuário:",
        error.response?.data || error
      );
      setUser(null);
      setUserPhoto(null);
      await AsyncStorage.removeItem("userInfo");
    }
  };

  // 🔹 Carrega usuário sempre que o token muda, mas espera loading do AuthContext
  useEffect(() => {
    if (!loading && authUser?.token) {
      fetchUser(authUser.token);
    } else if (!loading && !authUser?.token) {
      // Se não houver token, limpa o usuário
      setUser(null);
      setUserPhoto(null);
      AsyncStorage.removeItem("userInfo");
    }
  }, [authUser?.token, loading]);

  // 🔹 Upload e atualização da foto
  const setUserPhotoUpload = async (uri) => {
    if (!authUser?.token) return;

    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "perfil.jpg",
      });

      const response = await api.put("/usuario/imagem", formData, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data;
      console.log("✅ Foto atualizada no backend:", updatedUser.imagemUrl);

      setUser(updatedUser);
      setUserPhoto(updatedUser.imagemUrl);

      await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(
        "❌ Erro ao enviar imagem:",
        error.response?.data || error
      );
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userPhoto,
        setUserPhoto: setUserPhotoUpload,
        fetchUser, // exporta para atualizar manualmente após cadastro
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
