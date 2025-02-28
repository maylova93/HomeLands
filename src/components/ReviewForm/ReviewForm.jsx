import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./ReviewForm.module.scss";

export const ReviewForm = ({ userData, onReviewSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Udfyld venligst alle felter.");
      return;
    }

    try {
      const response = await fetch("https://api.mediehuset.net/homelands/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.access_token}`,
        },
        body: JSON.stringify({ 
          title, 
          content,
          user_id: userData?.id,
          active: true,
          num_stars: 3 
        }),
      });

      if (response.ok) {
        alert("Anmeldelse tilføjet!");
        setTitle("");
        setContent("");
        onReviewSubmit(); // 🔥 Kalder funktionen for at refetche anmeldelser
      } else {
        alert("Fejl ved tilføjelse af anmeldelse.");
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse:", error);
    }
  };

  return (
    <div className={styles.ReviewFormContainer}>
      <form onSubmit={handleSubmit} className={styles.ReviewForm}>
        <label>
          Titel:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Anmeldelse:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <div className={styles.ButtonWrapper}>
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

ReviewForm.propTypes = {
  userData: PropTypes.shape({
    access_token: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onReviewSubmit: PropTypes.func.isRequired,
};
