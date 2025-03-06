import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Henter brugerdata
import { FaHeart } from "react-icons/fa"; // Importerer hjerteikonet til favoritmarkering
import { Title } from "../../components/Title/Title"; // Importerer Title-komponenten
import styles from "./BoligSalg.module.scss"; // Importerer styling

/**
 * 📌 BoligSalg-komponenten:
 * - Henter boliger fra API'et og viser dem i en liste
 * - Filtrerer og sorterer boliger baseret på pris og boligtype
 * - Giver brugere mulighed for at markere favoritter (kræver login)
 * - Navigerer til en boligdetaljeside, hvis brugeren er logget ind
 */

export const BoligSalg = () => {
  const { userData } = useContext(UserContext); // Henter brugerdata fra kontekst
  const [houses, setHouses] = useState([]); // Tilstand til at gemme alle boliger
  const [filteredHouses, setFilteredHouses] = useState([]); // Tilstand til filtrerede boliger
  const [sortType, setSortType] = useState("default"); // Tilstand til sorteringsmetode
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Prisfilter
  const [favorites, setFavorites] = useState([]); // Favoritboliger
  const navigate = useNavigate(); // Bruges til at navigere til andre sider

  /**
   * 🔄 useEffect: Henter boligdata ved første indlæsning
   */
  useEffect(() => {
    fetch("https://api.mediehuset.net/homelands/homes")
      .then(response => response.json()) // Konverterer respons til JSON
      .then(data => {
        setHouses(data.items); // Gemmer alle boliger i state
        setFilteredHouses(data.items); // Initialt vises alle boliger
      });
  }, []);

  /**
   * ❤️ toggleFavorite: Tilføjer eller fjerner en bolig fra favoritter
   */
  const toggleFavorite = (house) => {
    if (!userData) return; // Kræver login for at markere favoritter
    setFavorites((prev) =>
      prev.includes(house.id) ? prev.filter((id) => id !== house.id) : [...prev, house.id]
    );
  };

  /**
   * 📌 handleSort: Sorterer boliger efter valgt kriterie
   */
  const handleSort = (e) => {
    const value = e.target.value;
    setSortType(value);
    
    let sortedHouses = [...houses];
    if (value === "price_low") {
      sortedHouses.sort((a, b) => a.price - b.price); // Sorterer efter laveste pris
    } else if (value === "price_high") {
      sortedHouses.sort((a, b) => b.price - a.price); // Sorterer efter højeste pris
    } else if (value === "type") {
      sortedHouses.sort((a, b) => a.type.localeCompare(b.type)); // Sorterer efter boligtype
    } else if (value === "favorites" && userData) {
      sortedHouses = sortedHouses.filter((house) => favorites.includes(house.id)); // Filtrerer favoritter
    }

    setFilteredHouses(sortedHouses);
  };

/**
 * 💰 handlePriceChange: Filtrerer boliger baseret på brugerens valgte prisniveau.
 * - Når brugeren ændrer prisfilteret (input slider), opdaterer vi prisintervallet.
 * - Vi filtrerer derefter boligerne, så kun de boliger, der koster mindre end eller lig med den valgte pris, vises.
 */
const handlePriceChange = (e) => {
  const value = e.target.value; // Henter den valgte værdi fra inputfeltet (pris-slideren)
  
  setPriceRange([0, parseInt(value)]); // Opdaterer prisintervallet, så det starter fra 0 til den valgte værdi
  
  setFilteredHouses(
    houses.filter(house => house.price <= value) // Filtrerer boliger, så kun dem, der er under eller lig med den valgte pris, vises
  );
};


  return (
    <div className={styles.boligSalg}>
      {/* 🔹 Header med titel og filtre */}
      <div className={styles.header}>
        <Title text="Boliger til salg" />
        <div className={styles.filters}>
          <label>Sorter efter prisniveau</label>
          <input 
            type="range" 
            min="0" 
            max="10000000" 
            step="50000" 
            value={priceRange[1]} 
            onChange={handlePriceChange} 
          />
          <select onChange={handleSort} value={sortType}>
            <option value="default">Sorter efter type</option>
            <option value="price_low">Laveste pris</option>
            <option value="price_high">Højeste pris</option>
            <option value="type">Boligtype</option>
            {userData && <option value="favorites">Favoritter</option>}
          </select>
        </div>
      </div>
  
      {/* 🔹 Viser boliger i grid-layout */}
      <div className={styles.grid}>
        {filteredHouses.map((house) => (
          <article 
            key={house.id} 
            className={styles.houseCard} 
            onClick={() => {
              if (userData) {
                navigate(`/bolig/${house.id}`); // Sender brugeren til boligdetaljer
              } else {
                alert("Du skal være logget ind for at se detaljer om boligen."); // Kræver login
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && userData && navigate(`/bolig/${house.id}`)}
          >
            {/* 🏡 Boligbillede */}
            <img src={house.images[0]?.filename.medium} alt={house.address} />
            
            {/* 🏡 Boligoplysninger */}
            <div className={styles.houseInfo}>
              <h2>{house.address}</h2>
              <p>{house.zipcode} {house.city}</p>
              <p>{house.floor_space} m² | {house.num_rooms} værelser</p>
              <p><strong>{house.type}</strong></p>
  
              {/* 🔋 Energimærke */}
              <div className={styles.energyContainer}>
                <span className={styles.energyLabel}>{house.energy_label_name}</span>
              </div>
  
              {/* 💰 Pris */}
              <p className={styles.price}>{parseInt(house.price).toLocaleString()} DKK</p>
  
              {/* ❤️ Favoritknap (kræver login) */}
              {userData && (
                <button className={`${styles.favoriteIcon} ${favorites.includes(house.id) ? styles.active : ""}`} 
                  onClick={(e) => {
                    e.stopPropagation(); // Forhindrer at navigere til detaljer
                    toggleFavorite(house);
                  }}>
                  <FaHeart />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
