import SessionsCarousel from "./SessionsCarousel";
import styles from "./SessionsSection.module.scss";

export default function SessionsSection() {
  return (
    <section aria-labelledby="sessions-heading" className={styles.section}>
      <SessionsCarousel />
    </section>
  );
}
