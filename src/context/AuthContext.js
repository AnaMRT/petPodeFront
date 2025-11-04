import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) setUser({ token });
      } catch (e) {
        console.error("Erro ao carregar token", e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      setUser({ token });
    } catch (e) {
      console.error("Erro ao salvar token", e);
    }
  };

  const logout = async () => {
    try {
      // Remove token e dados do usuário
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      setUser(null);
    } catch (e) {
      console.error("Erro ao remover token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};