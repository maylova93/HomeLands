import { useState, useEffect } from "react"; // Importerer useState og useEffect fra React
import { FaImages, FaMapMarkerAlt, FaRegHeart, FaClipboardList } from "react-icons/fa"; // Importerer ikoner fra react-icons
import { Modal } from "../Modal/Modal"; // Importerer Modal-komponenten
import styles from "./PropertyDetails.module.scss"; // Importerer styling fra SCSS-fil

/**
 * 📌 PropertyDetails-komponenten viser detaljer om en bolig.
 * - Viser billeder, beskrivelse, pris og kontaktinformation.
 * - Holder styr på favoritter og visninger.
 * - Indeholder en modal til billedgalleri, plantegning og kort.
 */

export const PropertyDetails = ({ home, user, onFavoriteToggle }) => {
  const [activeModal, setActiveModal] = useState(null); // Holder styr på hvilken modal der er åben
  const [isFavorite, setIsFavorite] = useState(false); // Holder styr på om boligen er i favoritter
  const [clicks, setClicks] = useState(home.num_clicks || 0); // Antal visninger af boligen

  /**
   * 📌 useEffect 1: Tjekker, om boligen er gemt som favorit for den aktuelle bruger
   */
  useEffect(() => {
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(home.id));
    }
  }, [user, home.id]); // Kører, når user eller home.id ændres

  /**
   * 📌 useEffect 2: Opdaterer antallet af visninger, når komponenten indlæses
   */
  useEffect(() => {
    const updateClicks = async () => {
      try {
        const response = await fetch(`/api/properties/${home.id}/clicks`, {
          method: "POST",
        });
        const data = await response.json();
        setClicks(data.clicks);
      } catch (error) {
        console.error("Failed to update clicks:", error);
      }
    };

    updateClicks();
  }, [home.id]); // Kører, når home.id ændres

  if (!home) return null; // Returnerer ingenting, hvis der ikke er nogen boligdata

  return (
    <section className={styles.PropertyDetails}>
      {/* 📌 Billedsektion - viser hovedbillede */}
      <div className={styles.ImageContainer}>
        <img src={home.images.find(img => img.is_main === "1")?.filename.large} alt={home.address} />
      </div>

      {/* 📌 Boligoplysninger */}
      <div className={styles.Info}>
        <h1>{home.address}</h1>
        <p>{home.zipcode} {home.city}</p>
        <p>{home.type} | {home.floor_space} m² | {home.num_rooms} værelser</p>
        <p>Set {clicks} gange</p>

        {/* 📌 Ikoner til funktioner */}
        <div className={styles.IconBar}>
          <FaImages onClick={() => setActiveModal("gallery")} title="Billedgalleri" />
          <FaClipboardList onClick={() => setActiveModal("floorplan")} title="Plantegning" />
          <FaMapMarkerAlt onClick={() => setActiveModal("map")} title="Kortvisning" />
          <FaRegHeart
            onClick={() => {
              if (user) {
                setIsFavorite(!isFavorite);
                onFavoriteToggle(home.id);
              } else {
                alert("Du skal være logget ind for at tilføje til favoritter.");
              }
            }}
            title="Tilføj til favoritter"
            className={isFavorite ? styles.Favorite : ""}
          />
        </div>

        {/* 📌 Prisoplysninger */}
        <div className={styles.PriceBox}>
          <strong>Kontantpris:</strong> {parseInt(home.price).toLocaleString()} DKK
          <br />
          <small>Udbetaling: {parseInt(home.payout).toLocaleString()} DKK</small>
          <br />
          <small>Ejerudgift pr. måned: {parseInt(home.cost).toLocaleString()} DKK</small>
        </div>
      </div>

      {/* 📌 Ekstra detaljer i et grid */}
      <div className={styles.DetailsGrid}>
        <div><strong>Boligareal:</strong> {home.floor_space} m²</div>
        <div><strong>Byggeår:</strong> {home.year_construction}</div>
        <div><strong>Rum:</strong> {home.num_rooms}</div>
        <div><strong>Energimærke:</strong> {home.energy_label_name}</div>
        <div><strong>Grundareal:</strong> {home.plot_size} m²</div>
        <div><strong>Sagsnummer:</strong> {home.id}</div>
      </div>

      {/* 📌 Beskrivelse af boligen */}
      <div className={styles.Description}>
        <h2>Beskrivelse</h2>
        <p>{home.description}</p>
      </div>

      {/* 📌 Kontaktinformation på ejendomsmægler */}
      <div className={styles.Contact}>
        <h2>Kontakt</h2>
        <img src={home.staff?.image} alt={`${home.staff?.firstname} ${home.staff?.lastname}`} />
        <p>{home.staff?.firstname} {home.staff?.lastname}</p>
        <p>{home.staff?.position}</p>
        <p>{home.staff?.phone}</p>
        <p><a href={`mailto:${home.staff?.email}`}>{home.staff?.email}</a></p>
      </div>

      {/* 📌 Modaler til galleri, plantegning og kort */}
      {activeModal && (
        <Modal onClose={() => setActiveModal(null)}>
          {activeModal === "gallery" && <Gallery images={home.images} />}
          {activeModal === "floorplan" && <FloorPlan image={home.floor_plan} />}
          {activeModal === "map" && <Map location={home.location} />}
        </Modal>
      )}
    </section>
  );
};

/**
 * 📌 Komponenter til modal-indhold
 */
const Gallery = ({ images }) => (
  <div>
    <h2>Billedgalleri</h2>
    {images.map(img => (
      <img key={img.id} src={img.filename.large} alt="Galleri" />
    ))}
  </div>
);

const FloorPlan = ({ image }) => (
  <div>
    <h2>Plantegning</h2>
    <img src={image} alt="Plantegning" />
  </div>
);

const Map = ({ location }) => (
  <div>
    <h2>Kort</h2>
    <iframe
      title="Google Maps"
      src={`https://www.google.com/maps?q=${location.lat},${location.lng}&output=embed`}
      width="100%"
      height="400px"
    />
  </div>
);
