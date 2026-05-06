"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "./_components/(root)/Footer/Footer";
import styles from "./not-found.module.scss";

const REDIRECT_SECONDS = 30;

export default function NotFound() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/");
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, router]);

  return (
    <>
      <main id="main-content" className={styles.main}>
        <div className={styles.content}>
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>This page's gone walkabout.</h1>
          <p className={styles.subtext}>
            No dramas — heading back home in{" "}
            <span aria-live="polite" aria-atomic="true">
              {seconds} {seconds === 1 ? "second" : "seconds"}
            </span>
            .
          </p>
          <Link href="/" className={styles.cta}>
            Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
