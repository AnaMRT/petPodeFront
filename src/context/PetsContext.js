import React, { createContext, useState } from "react";

export const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
  const [pets, setPets] = useState([]); 

  return (
    <PetsContext.Provider value={{ pets, setPets }}>
      {children}
    </PetsContext.Provider>
  );
};
