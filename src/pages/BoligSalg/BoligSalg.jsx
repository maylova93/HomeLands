import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { FaHeart } from "react-icons/fa";
import { Title } from "../../components/Title/Title"; 
import styles from "./BoligSalg.module.scss";

export const BoligSalg = () => {
  const { userData } = useContext(UserContext);
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000000]); 
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.mediehuset.net/homelands/homes")
      .then(response => response.json())
      .then(data => {
        setHouses(data.items);
        setFilteredHouses(data.items);
      });
  }, []);

  const toggleFavorite = (house) => {
    if (!userData) return;
    setFavorites((prev) =>
      prev.includes(house.id) ? prev.filter((id) => id !== house.id) : [...prev, house.id]
    );
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortType(value);
    
    let sortedHouses = [...houses];
    if (value === "price_low") {
      sortedHouses.sort((a, b) => a.price - b.price);
    } else if (value === "price_high") {
      sortedHouses.sort((a, b) => b.price - a.price);
    } else if (value === "type") {
      sortedHouses.sort((a, b) => a.type.localeCompare(b.type));
    } else if (value === "favorites" && userData) {
      sortedHouses = sortedHouses.filter((house) => favorites.includes(house.id));
    }

    setFilteredHouses(sortedHouses);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange([0, parseInt(value)]);
    setFilteredHouses(houses.filter(house => house.price <= value));
  };

  return (
    <div className={styles.boligSalg}>
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
  
      <div className={styles.grid}>
        {filteredHouses.map((house) => (
          <article 
            key={house.id} 
            className={styles.houseCard} 
            onClick={() => {
              if (userData) {
                navigate(`/bolig/${house.id}`); 
              } else {
                alert("Du skal være logget ind for at se detaljer om boligen."); 
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && userData && navigate(`/bolig/${house.id}`)}
          >
            <img src={house.images[0]?.filename.medium} alt={house.address} />
            <div className={styles.houseInfo}>
              <h2>{house.address}</h2>
              <p>{house.zipcode} {house.city}</p>
              <p>{house.floor_space} m² | {house.num_rooms} værelser</p>
              <p><strong>{house.type}</strong></p>
  
              <div className={styles.energyContainer}>
                <span className={styles.energyLabel}>{house.energy_label_name}</span>
              </div>
  
              <p className={styles.price}>{parseInt(house.price).toLocaleString()} DKK</p>
  
              {userData && (
                <button className={`${styles.favoriteIcon} ${favorites.includes(house.id) ? styles.active : ""}`} 
                  onClick={(e) => {
                    e.stopPropagation();
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
