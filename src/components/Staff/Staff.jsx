import { useGet } from "../../hooks/useGet"; // Importerer useGet hook til at hente API-data
import { Title } from "../../components/Title/Title"; // Importerer Title-komponenten til overskrift
import styles from "./Staff.module.scss"; // Importerer SCSS-styling for Staff-sektionen

/**
 * 📌 Staff-komponenten:
 * - Henter data om ansatte fra API’et.
 * - Viser en liste med ansatte inklusiv billede, navn, titel og kontaktoplysninger.
 */

export const Staff = () => {
  // 📌 Henter data fra API’et via useGet() hook
  const { data, error, isLoading } = useGet("https://api.mediehuset.net/homelands/staff");

  // 📌 Viser en indlæsningsmeddelelse, hvis data endnu ikke er hentet
  if (isLoading) return <p>Indlæser ansatte...</p>;
  
  // 📌 Viser en fejlmeddelelse, hvis der opstår problemer med at hente data
  if (error) return <p>Fejl ved hentning af data.</p>;

  return (
    <section className={styles.staffContainer}>
      {/* 📌 Sektionstitel - Brug af Title-komponenten */}
      <div className={styles.titleWrapper}>
        <Title text="Mød vores ansatte" />
      </div>

      {/* 📌 Viser en liste med ansatte i et grid-layout */}
      <div className={styles.staffGrid}>
        {data?.items?.map((staff) => (
          <div key={staff.id} className={styles.staffCard}>
            {/* 📌 Viser medarbejderens billede */}
            <img src={staff.image} alt={`${staff.firstname} ${staff.lastname}`} />
            
            {/* 📌 Viser navn og stilling */}
            <div className={styles.info}>
              <h3>{staff.firstname} {staff.lastname}</h3>
              <p>{staff.position}</p>
            </div>

            {/* 📌 Viser kontaktoplysninger */}
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
