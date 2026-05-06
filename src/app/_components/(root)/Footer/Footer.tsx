import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bannerSection}>
        <div className={styles.bannerWrapper}>
          <div className={styles.bannerImageContainer}>
            <Image
              src="/assets/landing/footerImg.jpeg"
              alt="Handcrafted pottery pieces arranged on a warm wooden surface"
              fill
              sizes="(max-width: 480px) calc(100vw - 48px), (max-width: 768px) calc(100vw - 64px), (max-width: 1440px) calc(100vw - 128px), 1312px"
              className={styles.bannerImage}
            />
          </div>
        </div>
      </div>

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
