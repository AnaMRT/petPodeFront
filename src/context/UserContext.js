import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import api from "../../api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Dados do usuário
  const [userPhoto, setUserPhoto] = useState(null);
  const { user: authUser, loading } = useContext(AuthContext);

  const fetchUser = async (token) => {
    if (!token) return;

    try {
      console.log(" Buscando usuário logado com token:", token);
      const response = await api.get("/usuario/logado", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      console.log(" Usuário carregado:", userData);

      setUser(userData);
      setUserPhoto(userData.imagemUrl || null);

      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (error) {
      console.log(
        " Erro ao carregar usuário:",
        error.response?.data || error
      );
      setUser(null);
      setUserPhoto(null);
      await AsyncStorage.removeItem("userInfo");
    }
  };

  useEffect(() => {
    if (!loading && authUser?.token) {
      fetchUser(authUser.token);
    } else if (!loading && !authUser?.token) {
      setUser(null);
      setUserPhoto(null);
      AsyncStorage.removeItem("userInfo");
    }
  }, [authUser?.token, loading]);

  const setUserPhotoUpload = async (uri) => {
  if (!authUser?.token) return false;

  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "perfil.jpg",
    });

    // Envia a imagem
    await api.put("/usuario/imagem", formData, {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Foto enviada com sucesso. Recarregando usuário...");

    // Aqui está a diferença importante:
    // força carregar o usuário atualizado do backend
    await fetchUser(authUser.token);

    return true;

  } catch (error) {
    console.error("❌ Erro ao enviar imagem:", error.response?.data || error);
    return false;
  }
};


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userPhoto,
        setUserPhoto: setUserPhotoUpload,
        fetchUser, 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};