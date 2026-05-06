import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="ClayLabs — go to homepage"
          >
            ClayLabs
          </Link>
          <a href="#book" className={styles.cta}>
            get started
          </a>
        </div>

        <div className={styles.contactRow}>
          <a href="mailto:hello@claylabs.com.au" className={styles.contactLink}>
            hello@claylabs.com.au
          </a>
          <a href="tel:+61123456789" className={styles.contactLink}>
            +61 123 456 789
          </a>
        </div>

        <div className={styles.bottomRow}>
          <nav aria-label="Legal navigation" className={styles.legalLinks}>
            <Link href="/terms" className={styles.legalLink}>
              terms
            </Link>
            <Link href="/privacy" className={styles.legalLink}>
              privacy policy
            </Link>
            <Link href="/sitemap" className={styles.legalLink}>
              sitemap
            </Link>
          </nav>
          <p className={styles.copyright}>©ClayLabs. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
