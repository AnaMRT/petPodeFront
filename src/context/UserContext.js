import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api"; // ajuste o caminho conforme seu projeto

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await api.get("/usuario/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("[fetchUser]", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
