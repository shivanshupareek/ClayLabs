import Image from "next/image";
import styles from "./VisualBreak.module.scss";

export default function VisualBreak() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <Image
        src="/assets/landing/footerImg.jpeg"
        alt=""
        fill
        sizes="100vw"
        className={styles.image}
      />
    </div>
  );
}
