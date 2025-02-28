import { Link } from "react-router-dom";
import { Title } from "../../components/Title/Title"; 
import styles from "./ErrorPage.module.scss";

export const ErrorPage = () => {
  return (
    <div className={styles.errorContainer}>
      <Title text="Fejl 404 - Siden blev ikke fundet" className={styles.errorTitle} />
      <p className={styles.errorMessage}>
        Oops! Siden du prøver at tilgå, findes ikke. Klik på knappen nedenfor for at vende tilbage til forsiden.
      </p>
      <Link to="/" className={styles.homeButton}>Gå til forsiden</Link>
    </div>
  );
};
