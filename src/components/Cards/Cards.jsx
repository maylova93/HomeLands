import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGet } from '../../hooks/useGet';
import styles from './Cards.module.scss';
import { UserContext } from '../../context/UserContext';

export const Cards = () => {
  const { data, error, isLoading } = useGet('https://api.mediehuset.net/homelands/homes');
  const { userData } = useContext(UserContext); 
  const navigate = useNavigate(); // Brug useNavigate() til at skifte side

  if (isLoading) return <p>Indlæser...</p>;
  if (error) return <p>Fejl ved hentning af data.</p>;

  return (
    <section className={styles.CardsContainer} aria-labelledby="homes-heading">
      <div className={styles.CardsGrid}>
        {data?.items?.slice(0, 3).map(home => (
          <div
            key={home.id}
            className={styles.Card}
            onClick={() => userData ? navigate(`/bolig/${home.id}`) : alert("Du skal være logget ind for at se detaljer.")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && (userData ? navigate(`/bolig/${home.id}`) : alert("Du skal være logget ind for at se detaljer."))}
          >
            <article>
              <img src={home.images[0]?.filename.medium} alt={home.address} className={styles.CardImage} />
              <div className={styles.CardContent}>
                <h3>{home.address}</h3>
                <p>{home.zipcode} {home.city}</p>
                <p>{home.type}</p>
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
