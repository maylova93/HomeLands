import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import { Title } from "../../components/Title/Title";
import styles from "./AdminPage.module.scss";

export const AdminPage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const { data, error, isLoading, refetch } = useGet("https://api.mediehuset.net/homelands/reviews", userData?.access_token);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://api.mediehuset.net/homelands/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });

      if (response.ok) {
        refetch(); // 🔥 Opdaterer listen uden at reloade siden
      } else {
        alert("Kunne ikke slette anmeldelse.");
      }
    } catch (error) {
      console.error("Fejl ved sletning:", error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Title text="Administration" />
      <p>Du er logget ind som admin</p>
      
      {isLoading && <p>Indlæser anmeldelser...</p>}
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
              <td colSpan="3">Ingen anmeldelser fundet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
