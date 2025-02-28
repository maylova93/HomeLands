import { useState, useEffect } from "react";
import { FaImages, FaMapMarkerAlt, FaRegHeart, FaClipboardList } from "react-icons/fa";
import { Modal } from "../Modal/Modal";
import styles from "./PropertyDetails.module.scss";

export const PropertyDetails = ({ home, user, onFavoriteToggle }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [clicks, setClicks] = useState(home.num_clicks || 0);

  // Проверяем, добавлена ли недвижимость в избранное
  useEffect(() => {
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(home.id));
    }
  }, [user, home.id]);

  // Обновляем количество кликов
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
  }, [home.id]);

  if (!home) return null;

  return (
    <section className={styles.PropertyDetails}>
      {/* Большое изображение */}
      <div className={styles.ImageContainer}>
        <img src={home.images.find(img => img.is_main === "1")?.filename.large} alt={home.address} />
      </div>

      {/* Основная информация */}
      <div className={styles.Info}>
        <h1>{home.address}</h1>
        <p>{home.zipcode} {home.city}</p>
        <p>{home.type} | {home.floor_space} m² | {home.num_rooms} værelser</p>
        <p>Set {clicks} gange</p>

        {/* Иконки */}
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

        {/* Цена и расходы */}
        <div className={styles.PriceBox}>
          <strong>Kontantpris:</strong> {parseInt(home.price).toLocaleString()} DKK
          <br />
          <small>Udbetaling: {parseInt(home.payout).toLocaleString()} DKK</small>
          <br />
          <small>Ejerudgift pr. måned: {parseInt(home.cost).toLocaleString()} DKK</small>
        </div>
      </div>

      {/* Детали в три колонки */}
      <div className={styles.DetailsGrid}>
        <div><strong>Boligareal:</strong> {home.floor_space} m²</div>
        <div><strong>Byggeår:</strong> {home.year_construction}</div>
        <div><strong>Rum:</strong> {home.num_rooms}</div>
        <div><strong>Energimærke:</strong> {home.energy_label_name}</div>
        <div><strong>Grundareal:</strong> {home.plot_size} m²</div>
        <div><strong>Sagsnummer:</strong> {home.id}</div>
      </div>

      {/* Описание */}
      <div className={styles.Description}>
        <h2>Beskrivelse</h2>
        <p>{home.description}</p>
      </div>

      {/* Контактная информация */}
      <div className={styles.Contact}>
        <h2>Kontakt</h2>
        <img src={home.staff?.image} alt={`${home.staff?.firstname} ${home.staff?.lastname}`} />
        <p>{home.staff?.firstname} {home.staff?.lastname}</p>
        <p>{home.staff?.position}</p>
        <p>{home.staff?.phone}</p>
        <p><a href={`mailto:${home.staff?.email}`}>{home.staff?.email}</a></p>
      </div>

      {/* Модальные окна */}
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