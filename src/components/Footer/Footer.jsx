import { FaTwitter, FaFacebookF } from 'react-icons/fa';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.FooterContainer}>
      <div className={styles.FooterContent}>
        <p className={styles.Logo}>HomeLands</p>
        <address className={styles.Address}>
          Øster Uttrupvej 5<br />
          9000 Aalborg
        </address>
        <div className={styles.Contact}>
          <p><a href="mailto:info@homelands.dk">info@homelands.dk</a></p>
          <p><a href="tel:+4511223344">+45 1122 3344</a></p>
        </div>
        <nav className={styles.SocialIcons} aria-label="Sociale medier">
          <a href="#" aria-label="Twitter"><FaTwitter className={styles.Icon} /></a>
          <a href="#" aria-label="Facebook"><FaFacebookF className={styles.Icon} /></a>
        </nav>
      </div>
    </footer>
  );
};
