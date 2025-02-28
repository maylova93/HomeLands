import { useGet } from "../../hooks/useGet";
import { Title } from "../../components/Title/Title"; // Importer Title-komponenten
import styles from "./Staff.module.scss";

export const Staff = () => {
  const { data, error, isLoading } = useGet("https://api.mediehuset.net/homelands/staff");

  if (isLoading) return <p>Indlæser ansatte...</p>;
  if (error) return <p>Fejl ved hentning af data.</p>;

  return (
    <section className={styles.staffContainer}>
      {/* Brug Title-komponenten og sørg for at den er centreret */}
      <div className={styles.titleWrapper}>
        <Title text="Mød vores ansatte" />
      </div>

      <div className={styles.staffGrid}>
        {data?.items?.map((staff) => (
          <div key={staff.id} className={styles.staffCard}>
            <img src={staff.image} alt={`${staff.firstname} ${staff.lastname}`} />
            <div className={styles.info}>
              <h3>{staff.firstname} {staff.lastname}</h3>
              <p>{staff.position}</p>
            </div>
            <div className={styles.contact}>
              <p>Email: {staff.email}</p>
              <p>Mobil: {staff.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
