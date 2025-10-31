import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import api from "../../api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const { user: authUser, loading } = useContext(AuthContext);

  // ✅ Carrega usuário do backend quando tem token
  useEffect(() => {
    const loadUser = async () => {
      if (!authUser?.token) return;

      try {
        const response = await api.get("/usuario/logado", {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });

        setUser(response.data);
        setUserPhoto(response.data.imagemUrl || null);

        // salva caso queira recuperar sem chamar a API
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));

      } catch (error) {
        console.log("Erro ao carregar usuário:", error.response?.data || error);
      }
    };

    loadUser();
  }, [authUser]);

  // ✅ Upload e atualização da foto
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

      const novaUrl = response.data.imagemUrl;
      setUserPhoto(novaUrl);

      setUser((prev) => ({ ...prev, imagemUrl: novaUrl }));
      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({ ...user, imagemUrl: novaUrl })
      );

      console.log("✅ Foto atualizada!");

    } catch (error) {
      console.error("Erro ao enviar imagem:", error.response?.data || error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, userPhoto, setUserPhoto: setUserPhotoUpload }}>
      {children}
    </UserContext.Provider>
  );
};
