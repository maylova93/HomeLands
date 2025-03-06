import { useEffect, useState } from "react"; // Importerer useEffect og useState hooks fra React

/**
 * 📌 useGet – En brugerdefineret hook til at udføre GET-anmodninger
 * - Denne hook gør det lettere at hente data fra API'er.
 * - Den håndterer datahentning, fejl, og loading-status automatisk.
 */

export function useGet(url, token) {
  const [data, setData] = useState(); // State til at gemme de hentede data
  const [error, setError] = useState(); // State til at gemme eventuelle fejl
  const [isLoading, setIsLoading] = useState(); // State til at angive, om data er under indlæsning

  /**
   * 📌 useEffect – Henter data ved komponentens rendering eller når URL ændres
   * - Når komponenten renderes, starter useEffect en GET-anmodning til det angivne URL.
   * - Hvis URL ændrer sig, kører useEffect igen og henter de nye data.
   */
  useEffect(() => {
    setIsLoading(true); // Indikerer at data bliver hentet

    /**
     * 🔹 Opsætning af fetch-request
     * - Hvis en token er tilgængelig, tilføjes den i Authorization-headeren.
     * - Hvis der ikke er en token, sendes anmodningen uden ekstra headers.
     */
    const options = {
      headers: token
        ? {
            Authorization: `Bearer ${token}`, // Sender token med i request, hvis brugeren er logget ind
          }
        : {}, // Hvis der ikke er nogen token, sendes anmodningen uden headers
    };

    /**
     * 🛠️ Udfører fetch-anmodning:
     * - Henter data fra API'et via fetch()
     * - Konverterer responsen til JSON-format
     * - Gemmer de hentede data i state
     * - Håndterer fejl, hvis der opstår problemer
     * - Afslutter loading-status uanset om anmodningen lykkes eller fejler
     */
    fetch(url, options)
      .then((res) => res.json()) // Konverterer responsen til JSON
      .then((data) => setData(data)) // Gemmer data i state
      .catch((err) => setError(err)) // Fanger og gemmer fejl i state
      .finally(() => setIsLoading(false)); // Stopper loading-status uanset resultat

  }, [url]); // useEffect kører igen, hvis URL ændrer sig

  /**
   * 📌 Returnerer objekt med data, fejl og loading-status
   * - Dette gør det nemt at bruge i komponenter uden at skulle håndtere fetch manuelt.
   */
  return { data, error, isLoading };
}
