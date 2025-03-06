import { useState } from "react"; // Importerer useState til håndtering af formularens inputfelter
import PropTypes from "prop-types"; // Importerer PropTypes for at validere props
import styles from "./ReviewForm.module.scss"; // Importerer SCSS-styling

/**
 * 📌 ReviewForm-komponenten:
 * - Gør det muligt for brugere at indsende anmeldelser
 * - Sender anmeldelsen til API’et via en POST-anmodning
 * - Opdaterer anmeldelseslisten efter en succesfuld indsendelse
 */

export const ReviewForm = ({ userData, onReviewSubmit }) => {
  const [title, setTitle] = useState(""); // State til anmeldelsens titel
  const [content, setContent] = useState(""); // State til anmeldelsens indhold

  /**
   * 📌 handleSubmit: Håndterer indsendelse af anmeldelsen
   * - Stopper standard formularafsendelse (e.preventDefault())
   * - Validerer, at titel og indhold ikke er tomme
   * - Sender anmeldelsen til API’et via en POST-anmodning
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forhindrer siden i at genindlæse ved submit

    // Validering: Sikrer, at felterne ikke er tomme
    if (!title || !content) {
      alert("Udfyld venligst alle felter.");
      return;
    }

    try {
      // 📌 API-anmodning: Sender anmeldelsen til serveren
      const response = await fetch("https://api.mediehuset.net/homelands/reviews", {
        method: "POST", // POST-metode bruges til at indsende ny data
        headers: {
          "Content-Type": "application/json", // Angiver, at vi sender JSON-data
          Authorization: `Bearer ${userData?.access_token}`, // Tilføjer brugerens token for autentificering
        },
        body: JSON.stringify({ 
          title, 
          content,
          user_id: userData?.id, // Brugerens ID knyttes til anmeldelsen
          active: true, // Markerer anmeldelsen som aktiv
          num_stars: 3 // Standard antal stjerner
        }),
      });

      // 📌 Håndtering af serverens svar
      if (response.ok) {
        alert("Anmeldelse tilføjet!"); // Giver brugeren besked om succes
        setTitle(""); // Nulstiller inputfeltet for titel
        setContent(""); // Nulstiller inputfeltet for anmeldelsesteksten
        onReviewSubmit(); // 🔥 Kalder funktionen for at refetche anmeldelser
      } else {
        alert("Fejl ved tilføjelse af anmeldelse."); // Fejlbesked ved mislykket indsendelse
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse:", error); // Logger fejl i konsollen
    }
  };

  return (
    <div className={styles.ReviewFormContainer}>
      <form onSubmit={handleSubmit} className={styles.ReviewForm}>
        {/* 📌 Inputfelt til anmeldelsens titel */}
        <label>
          Titel:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Opdaterer state ved indtastning
            required
          />
        </label>

        {/* 📌 Inputfelt til anmeldelsens tekst */}
        <label>
          Anmeldelse:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)} // Opdaterer state ved indtastning
            required
          />
        </label>

        {/* 📌 Indsendelsesknap */}
        <div className={styles.ButtonWrapper}>
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

/**
 * 📌 PropTypes validering:
 * - Sikrer, at komponenten får de rigtige typer data som props
 */
ReviewForm.propTypes = {
  userData: PropTypes.shape({
    access_token: PropTypes.string.isRequired, // Kræver en access_token for autentificering
    id: PropTypes.number.isRequired, // Brugerens ID kræves for at knytte anmeldelsen til en bruger
  }).isRequired,
  onReviewSubmit: PropTypes.func.isRequired, // Funktion til at genindlæse anmeldelser efter en ny anmeldelse
};
