import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ nome: "Usuário", email: "usuario@exemplo.com", senha: "123456" });
  const [userPhoto, setUserPhotoState] = useState(null);
  const { user: authUser, loading } = useContext(AuthContext);

  const setUserPhoto = async (uri) => {
    if (!uri) {
      setUserPhotoState(null);
      return;
    }

    if (loading) {
      console.warn("Token ainda está sendo carregado");
      return;
    }

    if (!authUser?.token) {
      console.error("Token não disponível. Usuário precisa estar logado.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "perfil.jpg",
      });

      const response = await fetch("https://petpodeback.onrender.com/usuario/imagem", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao enviar imagem:", text);
        return;
      }

      const data = await response.json();
      console.log("Upload realizado:", data);
      setUserPhotoState(data.imagemUrl);

    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, userPhoto, setUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
};
