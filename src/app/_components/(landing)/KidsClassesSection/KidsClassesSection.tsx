import { ArrowRight } from "lucide-react";
import Image from "next/image";
import styles from "./KidsClassesSection.module.scss";

const BULLETS = [
  "Kids aged 6 and above",
  "Children under 6 are welcome but must be accompanied by a guardian",
  "All ceramics are food and oven safe, made from high-quality ceramic materials",
  "Pieces take up to 4 weeks to be fired and glazed — you'll be notified once they're ready to collect",
];

export default function KidsClassesSection() {
  return (
    <section aria-labelledby="kids-classes-heading" className={styles.section}>
      <div className={styles.inner}>
        {/* Heading — spans full width above all three columns */}
        <h2 id="kids-classes-heading" className={styles.heading}>
          Kids classes
        </h2>

        {/* Left — body copy + price */}
        <div className={styles.left}>
          <div className={styles.body}>
            <p className={styles.text}>
              Looking for a fun and creative way to keep your child
              entertained during the school holidays? Our Kids Hand-Building
              Workshops are a great opportunity for young makers to explore
              the art of ceramics in a relaxed, hands-on environment.
            </p>
            <p className={styles.text}>
              In this two-hour session, children will learn the basics of
              hand-building with clay and get to create up to two unique
              pieces. All materials and equipment are provided, so all your
              child needs to bring is their imagination. The workshop is
              structured to be both educational and enjoyable, with plenty of
              guidance and encouragement along the way.
            </p>
          </div>
          <p className={styles.price}>$70 per person</p>
        </div>

        {/* Centre — portrait photo */}
        <div className={styles.imageWrapper}>
          <Image
            src="/assets/landing/kidsSessions/kidsSessions.png"
            alt="Children sitting around a table hand-building clay pieces"
            fill
            sizes="(max-width: 1024px) calc(100vw - 48px), calc((100vw - 160px) / 3)"
            className={styles.image}
          />
        </div>

        {/* Right — bullet rules + CTA */}
        <div className={styles.right}>
          <ul className={styles.bulletList}>
            {BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <a href="/?tab=kids#book" className={styles.cta}>
            <span className={styles.ctaLabel}>book classes</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              <ArrowRight size={14} focusable={false} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
