/**
 * Importerer nødvendige React hooks og funktioner.
 * - `createContext`: Bruges til at oprette en global kontekst, som kan deles mellem komponenter.
 * - `useState`: Bruges til at håndtere og opdatere den aktuelle brugerdata i konteksten.
 */
import { createContext, useState } from "react";

/**
 * Opretter en ny kontekst til at gemme og dele brugerens data i hele applikationen.
 * - `UserContext` giver global adgang til brugerens oplysninger.
 * - Det muliggør en centraliseret håndtering af brugerens login-status og data.
 * - Når `UserContext.Provider` bruges, kan alle børnekomponenter få adgang til brugerens oplysninger.
 */
export const UserContext = createContext();

/**
 * UserContextProvider håndterer brugerens autentificeringsstatus og data.
 * - Den gemmer brugerens oplysninger i state (`userData`).
 * - Den tjekker sessionStorage for gemte brugerdata ved første rendering.
 * - Den giver mulighed for at opdatere og slette brugerens data via `setUserData` og `logout`.
 * - Den deler denne funktionalitet med alle komponenter i applikationen gennem `UserContext.Provider`.
 */
export const UserContextProvider = ({ children }) => {
  /**
   * State til at håndtere brugerens login-data.
   * - Ved første rendering tjekker vi, om der allerede findes brugerdata i sessionStorage.
   * - Hvis ja, loades den eksisterende brugerdata i `userData`.
   * - Hvis nej, sættes `userData` til `null`.
   * - useState initialiseres med en funktion for at undgå unødvendige kald til sessionStorage.
   */
  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem("user"); // Henter brugerdata fra sessionStorage.
    return storedUser ? JSON.parse(storedUser) : null; // Hvis der findes data, konverteres den til et objekt.
  });

  /**
   * Funktion til at logge brugeren ud.
   * - Fjerner brugerens oplysninger fra sessionStorage.
   * - Opdaterer `userData` i state til `null`, så brugeren bliver logget ud.
   * - Dette sikrer, at brugerens login-status nulstilles i hele applikationen.
   */
  const logout = () => {
    sessionStorage.removeItem("user"); // Fjerner brugerdata fra sessionStorage.
    setUserData(null); // Nulstiller brugerdata i konteksten.
  };

  return (
    /**
     * Giver `userData`, `setUserData` og `logout` videre til alle underliggende komponenter.
     * - `userData`: Indeholder information om den loggede bruger.
     * - `setUserData`: Bruges til at opdatere brugerens oplysninger efter login.
     * - `logout`: Bruges til at logge brugeren ud og fjerne deres data.
     * - `children`: Refererer til de komponenter, der er pakket ind i `UserContextProvider`, 
     *   så de kan få adgang til konteksten.
     */
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children} {/* Gør det muligt for børn-komponenter at få adgang til konteksten */}
    </UserContext.Provider>
  );
};
