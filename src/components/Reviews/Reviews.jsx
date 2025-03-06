import { useState, useContext } from "react"; // Importerer useState og useContext hooks
import { Title } from "../../components/Title/Title"; // Importerer Title-komponenten til overskrifter
import { UserContext } from "../../context/UserContext"; // Henter brugerens data fra konteksten
import { useGet } from "../../hooks/useGet"; // Custom hook til at hente data fra API’et
import { ReviewForm } from "../ReviewForm/ReviewForm"; 
import styles from "./Reviews.module.scss";

/**
 * 📌 Reviews-komponenten:
 * - Henter og viser en tilfældig kundeanmeldelse fra API’et.
 * - Giver loggede brugere mulighed for at skrive en ny anmeldelse.
 */

export const Reviews = () => {
  const { userData } = useContext(UserContext); // Henter brugerdata fra konteksten
  const [showForm, setShowForm] = useState(false); // State til at vise/skjule anmeldelsesformularen
  
  // 📌 Henter anmeldelser fra API’et
  const { data, error, isLoading, refetch } = useGet("https://api.mediehuset.net/homelands/reviews");

  // 📌 Udvælger en tilfældig anmeldelse, hvis der findes nogen
  const review = data?.items?.length > 0 ? data.items[Math.floor(Math.random() * data.items.length)] : null;

  return (
    <section className={styles.ReviewsContainer} aria-labelledby="reviews-heading">
      {/* 📌 Sektionstitel */}
      <div className={styles.ReviewTitle} id="reviews-heading">
        <Title text="Det siger kunderne:" />
      </div>

      {/* 📌 Hvis brugeren har trykket på 'Skriv en anmeldelse', vises formularen */}
      {showForm ? (
        <ReviewForm 
          userData={userData} 
          onReviewSubmit={() => { 
            setShowForm(false); // Lukker formularen efter indsendelse
            refetch(); // 🔥 Henter nye anmeldelser, så den nye vises
          }} 
        />
      ) : (
        // 📌 Viser en tilfældig anmeldelse, hvis der ikke er fejl eller indlæsning
        isLoading ? (
          <p>Indlæser anmeldelse...</p>
        ) : error ? (
          <p>Fejl ved hentning af anmeldelser.</p>
        ) : (
          review && (
            <article className={styles.ReviewBox} aria-live="polite">
              <h3>{review.title}</h3>
              <p className={styles.ReviewContent}>
                <em>{review.content}</em>
              </p>
              <p className={styles.ReviewAuthor}>
                {review.user_name}, {new Date(review.date).toLocaleDateString("da-DK", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </article>
          )
        )
      )}

      {/* 📌 Viser knappen 'Skriv en anmeldelse' kun for loggede brugere */}
      {userData && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={styles.ReviewLink}
          aria-label="Skriv en anmeldelse"
        >
          Skriv en anmeldelse
        </button>
      )}
    </section>
  );
};
