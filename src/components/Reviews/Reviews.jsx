import { useState, useContext } from "react";
import { Title } from "../../components/Title/Title";
import { UserContext } from "../../context/UserContext";
import { useGet } from "../../hooks/useGet";
import { ReviewForm } from "../ReviewForm/ReviewForm";
import styles from "./Reviews.module.scss";

export const Reviews = () => {
  const { userData } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  
  const { data, error, isLoading, refetch } = useGet("https://api.mediehuset.net/homelands/reviews");

  const review = data?.items?.length > 0 ? data.items[Math.floor(Math.random() * data.items.length)] : null;

  return (
    <section className={styles.ReviewsContainer} aria-labelledby="reviews-heading">
      <div className={styles.ReviewTitle} id="reviews-heading">
        <Title text="Det siger kunderne:" />
      </div>

      {showForm ? (
        <ReviewForm userData={userData} onReviewSubmit={() => { 
          setShowForm(false); 
          refetch(); // 🔥 Henter nye anmeldelser efter en ny er tilføjet
        }} />
      ) : (
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
