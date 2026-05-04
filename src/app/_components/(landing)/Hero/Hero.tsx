import Image from "next/image";
import EmailForm from "./EmailForm";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.textRow}>
        <h1 id="hero-heading" className={styles.title}>
          Come shape something with your hands
        </h1>
        <p className={styles.subtext}>
          Slow down, get a little messy, and learn pottery in a calm, welcoming
          space. No experience needed—just show up and we&apos;ll guide you.
        </p>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <Image
            src="/assets/landing/heroImg.png"
            alt="Handcrafted pottery and ceramics arranged on stone slabs"
            fill
            priority
            quality={100}
            sizes="(max-width: 480px) calc(100vw - 48px), (max-width: 768px) calc(100vw - 64px), (max-width: 1440px) calc(100vw - 128px), 1312px"
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <EmailForm />
      </div>
    </section>
  );
}
