import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PlanoContext = createContext();

export const PlanoProvider = ({ children }) => {
  const [isAssinante, setIsAssinante] = useState(false);

  useEffect(() => {
    carregarStatus();
  }, []);

  const carregarStatus = async () => {
    try {
      const status = await AsyncStorage.getItem("planoAtivo");
      setIsAssinante(status === "true");
    } catch (err) {
      console.log("Erro ao carregar assinatura:", err);
    }
  };

  const assinarPlano = async () => {
    try {
      await AsyncStorage.setItem("planoAtivo", "true");
      setIsAssinante(true);
    } catch (err) {
      console.log("Erro ao ativar plano:", err);
    }
  };

  const cancelarPlano = async () => {
    try {
      await AsyncStorage.removeItem("planoAtivo");
      setIsAssinante(false);
    } catch (err) {
      console.log("Erro ao cancelar plano:", err);
    }
  };

  return (
    <PlanoContext.Provider value={{ isAssinante, assinarPlano, cancelarPlano }}>
      {children}
    </PlanoContext.Provider>
  );
};