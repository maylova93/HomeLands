import { useContext } from 'react'; // Importerer useContext til at få adgang til brugerens login-status
import { useNavigate } from 'react-router-dom'; // Importerer useNavigate til navigation
import { useGet } from '../../hooks/useGet'; // Importerer useGet, en custom hook til at hente data fra API
import styles from './Cards.module.scss'; // Importerer styling
import { UserContext } from '../../context/UserContext'; // Importerer UserContext til at håndtere brugerdata

/**
 * 📌 Cards-komponenten viser en oversigt over boliger fra API'et.
 * - Henter boligdata via useGet()
 * - Viser maks. 3 boliger i et grid-layout
 * - Sikrer, at kun loggede brugere kan se boligdetaljer
 */

export const Cards = () => {
  const { data, error, isLoading } = useGet('https://api.mediehuset.net/homelands/homes'); // Henter boligdata fra API
  const { userData } = useContext(UserContext); // Bruger useContext til at få adgang til brugerens login-data
  const navigate = useNavigate(); // useNavigate() bruges til at navigere til en ny side

  // 📌 Viser en indlæsningsbesked, hvis data stadig hentes
  if (isLoading) return <p>Indlæser...</p>;

  // 📌 Viser en fejlbesked, hvis der opstår en fejl ved datahentning
  if (error) return <p>Fejl ved hentning af data.</p>;

  return (
    <section className={styles.CardsContainer} aria-labelledby="homes-heading">
      <div className={styles.CardsGrid}>
        {data?.items?.slice(0, 3).map(home => ( // Viser kun de første tre boliger fra API'et
          <div
            key={home.id} // Unik nøgle til hver bolig
            className={styles.Card}
            
            /**
             * 📌 Navigationslogik:
             * - Hvis brugeren er logget ind, sendes de til boligdetaljesiden
             * - Hvis brugeren IKKE er logget ind, vises en advarsel i stedet
             */
            onClick={() => userData ? navigate(`/bolig/${home.id}`) : alert("Du skal være logget ind for at se detaljer.")}

            role="button" // Angiver at div'en fungerer som en knap
            tabIndex={0} // Gør elementet fokuserbart for tastatur-navigation
            onKeyDown={(e) => e.key === 'Enter' && (userData ? navigate(`/bolig/${home.id}`) : alert("Du skal være logget ind for at se detaljer."))}
          >
            <article>
              {/* 📌 Viser boligbilledet */}
              <img src={home.images[0]?.filename.medium} alt={home.address} className={styles.CardImage} />
              
              {/* 📌 Viser boligoplysninger */}
              <div className={styles.CardContent}>
                <h3>{home.address}</h3>
                <p>{home.zipcode} {home.city}</p>
                <p>{home.type}</p>
                
                {/* 📌 Viser boligens informationer såsom energimærke, værelser og pris */}
                <div className={styles.CardInfo}>
                  <span className={styles.EnergyLabel}>{home.energy_label_name}</span>
                  <span>{home.num_rooms} værelser, {home.floor_space} m²</span>
                  <span className={styles.Price}>{Number(home.price).toLocaleString()} DKK</span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};
