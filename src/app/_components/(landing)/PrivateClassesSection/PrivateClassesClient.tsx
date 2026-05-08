"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import BookingCtaLink from "../BookingCtaLink/BookingCtaLink";
import styles from "./PrivateClassesSection.module.scss";

const CARDS = [
  {
    id: "wheel-throwing",
    title: "Wheel throwing",
    src: "/assets/landing/privateSessions/wheelThrowing.png",
    iconSrc: "/assets/landing/privateSessions/wheelThrowingIcon.svg",
    alt: "Hands shaping clay on a pottery wheel",
    text: "Get creative on the pottery wheel in this fun 2-hour workshop for up to 4 people. We'll guide you through centering, pulling, and shaping — then trim and glaze your pieces after the session.",
  },
  {
    id: "party-time",
    title: "Party time",
    src: "/assets/landing/privateSessions/partyTime.png",
    iconSrc: "/assets/landing/privateSessions/partyTimeIcon.svg",
    alt: "Group of people enjoying a pottery session together",
    text: "A 2-hour private pottery session for your whole crew — all materials and firing included. Perfect for birthdays, hens parties, team building, or any reason to celebrate and get your hands dirty.",
  },
  {
    id: "hand-building",
    title: "Hand building",
    src: "/assets/landing/privateSessions/handBuilding.png",
    iconSrc: "/assets/landing/privateSessions/handBuildingIcon.svg",
    alt: "Hands sculpting a clay vessel without a wheel",
    text: "Create your own custom mug, bowl, or platter — no wheel required. This 2-hour session covers pinching, coiling, and slab work, with all materials, glazing, and firing taken care of.",
  },
];

const DURATION = 5000;

export default function PrivateClassesClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % CARDS.length);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  const card = CARDS[activeIndex];

  return (
    <div
      className={`${styles.inner} ${isPaused ? styles.pauseCursor : ""}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Heading — spans full width above both columns */}
      <h2 id="private-classes-heading" className={styles.heading}>
        Private classes
      </h2>

      {/* Left top — subtitle */}
      <div className={styles.leftTop}>
        <p className={styles.subtitle}>
          Get your hands dirty with someone you love — private pottery sessions
          for groups, parties, and special occasions.
        </p>
      </div>

      {/* Right panel — active card display */}
      <div className={styles.rightPanel}>
        <AnimatePresence mode="popLayout">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={styles.panelInner}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="(max-width: 1024px) calc(100vw - 48px), calc((100vw - 160px) / 2)"
              className={styles.cardImage}
              priority={activeIndex === 0}
            />
          </div>
          <div className={styles.cardMeta}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            {/* SVG icon — plain img is appropriate here: unoptimized SVG, decorative, fixed 32px */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.iconSrc}
              alt=""
              aria-hidden="true"
              className={styles.cardIcon}
              width={32}
              height={32}
            />
          </div>
          <p className={styles.cardText}>{card.text}</p>
        </motion.div>
        </AnimatePresence>
      </div>

      {/* Left bottom — tabs + price */}
      <div className={styles.leftBottom}>
        <div className={styles.tabList} role="tablist" aria-label="Private class types">
          {CARDS.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-pressed={i === activeIndex}
              className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className={styles.tabText}>{c.title}</span>
              <div className={styles.progressBar} aria-hidden="true">
                {i === activeIndex && (
                  <div
                    key={activeIndex}
                    className={`${styles.progressFill} ${isPaused ? styles.progressPaused : styles.progressActive}`}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        <p className={styles.price}>$90 per person</p>
        <BookingCtaLink
          tab="private"
          label="book private session"
          className={styles.cta}
          labelClassName={styles.ctaLabel}
          arrowClassName={styles.ctaArrow}
        />
      </div>
    </div>
  );
}
