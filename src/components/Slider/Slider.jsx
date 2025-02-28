import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Slider.module.scss";

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

export function Slide() {  
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    };
  
    return (
      <div className={styles["slideshow-container"]}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.src} alt={image.alt} className={styles["slide-image"]} />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
  