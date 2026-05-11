import Image from "next/image";
import BookingCtaLink from "../BookingCtaLink/BookingCtaLink";
import styles from "./KilnFiringSection.module.scss";

const FIRING_OPTIONS = ["Bisque firing (cone 06)", "Glaze firing (cone 6)"];

export default function KilnFiringSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="kiln-firing-heading"
    >
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <Image
            src="/assets/landing/kilnFiringServices/kilnFiringServices.png"
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.body}>
            <h2 id="kiln-firing-heading" className={styles.heading}>
              Kiln firing services
            </h2>

            <p className={styles.text}>
              Clayora offers professional bisque and glaze firing services for
              your ceramic pieces. Whether you&apos;ve been working with us in
              class or throwing at home, bring your work in and we&apos;ll fire
              it to a beautiful finish.
            </p>

            <ul className={styles.bulletList}>
              {FIRING_OPTIONS.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>

            <p className={styles.pricingNote}>
              Pricing is based on piece size — we&apos;ll confirm the cost
              before firing.
            </p>
          </div>

          <BookingCtaLink
            tab="kiln"
            label="book kiln firing"
            className={styles.cta}
            labelClassName={styles.ctaLabel}
            arrowClassName={styles.ctaArrow}
          />
        </div>
      </div>
    </section>
  );
}
