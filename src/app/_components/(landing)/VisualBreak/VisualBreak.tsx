import Image from "next/image";
import styles from "./VisualBreak.module.scss";

export default function VisualBreak() {
  return (
    <div className={styles.section} aria-hidden="true">
      <div className={styles.wrapper}>
        <Image
          src="/assets/landing/footerImg.jpeg"
          alt=""
          fill
          sizes="(max-width: 480px) calc(100vw - 48px), (max-width: 768px) calc(100vw - 64px), (max-width: 1440px) calc(100vw - 128px), 1312px"
          className={styles.image}
        />
      </div>
    </div>
  );
}
