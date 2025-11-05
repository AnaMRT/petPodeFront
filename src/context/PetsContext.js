import React, { createContext, useState } from "react";

export const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  const clearPets = () => setPets([]);

  return (
    <PetsContext.Provider value={{ pets, setPets, clearPets }}>
      {children}
    </PetsContext.Provider>
  );
};
