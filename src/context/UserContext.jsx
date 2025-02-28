import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = () => {
    sessionStorage.removeItem("user"); // Fjerner brugerdata fra session storage
    setUserData(null); // Opdaterer userData i context
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};
