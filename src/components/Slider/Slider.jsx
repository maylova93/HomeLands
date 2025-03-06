/**
 * Importerer nødvendige moduler og stilfiler.
 * - `Slider` er en React-komponent fra "react-slick", der bruges til at lave et billedslider.
 * - "slick-carousel/slick/slick.css" og "slick-carousel/slick/slick-theme.css" er nødvendige CSS-filer for at style slideren korrekt.
 * - `styles` importeres fra en lokal SCSS-fil for at anvende specifikke stilændringer til slideren.
 */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Slider.module.scss";

/**
 * En array af billeder, der skal vises i slideren.
 * - Hvert objekt i arrayet indeholder en `src` (billedets URL) og `alt` (alternativ tekst for skærmlæsere).
 */
const images = [
  {
    src: "https://api.mediehuset.net/images/homelands/large/apartment-3.jpg",
    alt: "Lejlighed",
  },
  {
    src: "https://api.mediehuset.net/images/homelands/large/house-1.jpg",
    alt: "Villa",
  },
  {
    src: "https://api.mediehuset.net/images/homelands/large/house-2.jpg",
    alt: "Villa",
  },
];

/**
 * `Slide` komponenten render en billedslider ved hjælp af "react-slick".
 * - Slideren viser billeder ét ad gangen.
 * - Den skifter billede automatisk hver 3. sekund.
 * - Den understøtter uendelig loop.
 */
export function Slide() {  
    /**
     * `settings` konfigurerer sliderens adfærd.
     * - `infinite: true` gør, at slideren kører i en uendelig loop.
     * - `speed: 500` definerer overgangen mellem slides (500ms).
     * - `slidesToShow: 1` betyder, at der kun vises ét billede ad gangen.
     * - `slidesToScroll: 1` sikrer, at der kun scrolles ét billede ad gangen.
     * - `autoplay: true` aktiverer automatisk afspilning.
     * - `autoplaySpeed: 3000` skifter billede automatisk hver 3. sekund.
     */
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    };
  
    return (
      /**
       * Wrapper-div med en klasse fra SCSS-filen for styling af slider-containeren.
       */
      <div className={styles["slideshow-container"]}>
        {/* Slider-komponent med de angivne indstillinger */}
        <Slider {...settings}>
          {/* Mapper gennem billed-arrayet og genererer et `div`-element for hvert billede */}
          {images.map((image, index) => (
            <div key={index}>
              {/* `img`-elementet viser billedet med en dynamisk `src` og `alt`-tekst */}
              <img src={image.src} alt={image.alt} className={styles["slide-image"]} />
            </div>
          ))}
        </Slider>
      </div>
    );
}
