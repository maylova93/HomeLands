import { useContext, useEffect } from "react"; // Importerer React Hooks til kontekst og sideeffekter
import { UserContext } from "../../context/UserContext"; // Importerer UserContext for at få adgang til brugerens login-status
import { useNavigate } from "react-router-dom"; // Importerer useNavigate til omdirigering af brugere
import { useGet } from "../../hooks/useGet"; // Importerer en custom hook til at hente data fra API'et
import { Title } from "../../components/Title/Title"; 
import styles from "./AdminPage.module.scss"; 

export const AdminPage = () => {
  const { userData } = useContext(UserContext); // Henter brugerdata fra konteksten for at se, om brugeren er logget ind
  const navigate = useNavigate(); // useNavigate bruges til at navigere brugeren til en anden side

  /**
   * 🛠️ useEffect – Sikrer adgangskontrol:
   * - useEffect kører automatisk, når komponenten renderes første gang.
   * - Den tjekker, om userData er defineret, dvs. om brugeren er logget ind.
   * - Hvis userData ikke findes (brugeren ikke er logget ind), sendes de til login-siden.
   * - useEffect har en afhængighedsliste ([userData, navigate]), så den kører igen, hvis userData ændrer sig.
   */
  useEffect(() => {
    if (!userData) {
      navigate("/login"); // Hvis brugeren ikke er logget ind, omdirigeres de til login-siden
    }
  }, [userData, navigate]); // Koden genkører, hvis userData eller navigate ændrer sig

  /**
   * 🛠️ useGet – Henter data fra API'et:
   * - Sender en GET-anmodning til API'et for at hente anmeldelser.
   * - Vi sender brugerens access_token i anmodningen for at sikre, at kun autoriserede brugere får adgang.
   * - Variablen data indeholder de hentede anmeldelser.
   * - isLoading viser en indikator, hvis data stadig indlæses.
   * - error fanger eventuelle fejl i anmodningen.
   */
  const { data, error, isLoading, refetch } = useGet(
    "https://api.mediehuset.net/homelands/reviews",
    userData?.access_token
  );

  /**
   * 🛠️ handleDelete – Funktion til at slette en anmeldelse:
   * - Denne funktion kaldes, når brugeren klikker på "Slet"-knappen.
   * - Vi sender en DELETE-anmodning til API'et for at fjerne den valgte anmeldelse.
   * - Authorization-headeren sender brugerens token, så API’et ved, at anmodningen er fra en autoriseret bruger.
   * - Hvis sletningen lykkes, kalder vi refetch() for at opdatere listen over anmeldelser uden at reloade hele siden.
   * - Hvis anmodningen fejler, vises en fejlbesked.
   */
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://api.mediehuset.net/homelands/reviews/${id}`, {
        method: "DELETE", // Angiver at vi sender en DELETE-anmodning
        headers: {
          Authorization: `Bearer ${userData?.access_token}`, // Sender brugerens token for at validere anmodningen
        },
      });

      if (response.ok) {
        refetch(); // 🔥 Opdaterer listen over anmeldelser uden at reloade hele siden
      } else {
        alert("Kunne ikke slette anmeldelse."); // Viser en fejlbesked, hvis sletning mislykkes
      }
    } catch (error) {
      console.error("Fejl ved sletning:", error); // Logger fejl i konsollen, hvis noget går galt
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Title text="Administration" /> {/* Viser en overskrift på siden */}
      <p>Du er logget ind som admin</p> {/* Informerer brugeren om deres adgangsniveau */}

      {/* Viser en besked, hvis data er ved at blive hentet */}
      {isLoading && <p>Indlæser anmeldelser...</p>}
      {/* Viser en fejlbesked, hvis der opstår problemer med at hente data */}
      {error && <p style={{ color: "red" }}>Der opstod en fejl ved indlæsning af anmeldelser.</p>}

      <table className={styles.reviewTable}>
        <thead>
          <tr>
            <th>Dine anmeldelser</th>
            <th>Dato</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {/* Hvis der findes anmeldelser, vises de i tabellen */}
          {data?.items?.length > 0 ? (
            data.items.map((review) => (
              <tr key={review.id}>
                <td>{review.title}</td>
                <td>{new Date(review.created * 1000).toLocaleDateString("da-DK")}</td>
                <td>
                  <button onClick={() => handleDelete(review.id)} className={styles.deleteButton}>
                    Slet
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Ingen anmeldelser fundet</td> {/* Vises, hvis der ikke er nogen anmeldelser */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
