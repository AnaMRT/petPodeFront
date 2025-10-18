import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    nome: "Usuário",
    email: "usuario@exemplo.com",
    senha: "123456",
  });

  const [userPhoto, setUserPhotoState] = useState(null);

  // Função para atualizar o estado e salvar no AsyncStorage
  const setUserPhoto = async (url) => {
    try {
      setUserPhotoState(url);
      if (url) {
        await AsyncStorage.setItem("userPhoto", url);
      } else {
        await AsyncStorage.removeItem("userPhoto");
      }
    } catch (error) {
      console.error("Erro ao salvar userPhoto no AsyncStorage:", error);
    }
  };

  // Carregar a foto do AsyncStorage quando o componente montar
  useEffect(() => {
    const carregarUserPhoto = async () => {
      try {
        const url = await AsyncStorage.getItem("userPhoto");
        if (url) {
          setUserPhotoState(url);
        }
      } catch (error) {
        console.error("Erro ao carregar userPhoto do AsyncStorage:", error);
      }
    };
    carregarUserPhoto();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userPhoto, setUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
};
