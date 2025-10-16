import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    nome: "Usuário",
    email: "usuario@exemplo.com",
    senha: "123456",
  });

  const [userPhoto, setUserPhoto] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, userPhoto, setUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
};
