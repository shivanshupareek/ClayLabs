"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./SessionsSection.module.scss";

const CARDS = [
  {
    src: "/assets/landing/sessionCard_1.png",
    alt: "Hands painting a pottery piece on a spinning wheel",
    title: "6-weeks journey",
    text: "A thoughtfully paced course that builds your confidence step by step—no rush, no overwhelm.",
  },
  {
    src: "/assets/landing/sessionCard_2.png",
    alt: "Handcrafted ceramic vessels arranged outdoors under a full moon",
    title: "Made by you, kept by you",
    text: "Walk away with pieces you created yourself—imperfect, personal, and yours to keep.",
  },
  {
    src: "/assets/landing/sessionCard_3.png",
    alt: "A woman working at a pottery wheel surrounded by lush greenery",
    title: "Time that's truly yours",
    text: "Two calm hours each week to slow down, focus, and reconnect with making.",
  },
  {
    src: "/assets/landing/sessionCard_4.png",
    alt: "A pottery studio with tools and materials arranged on a workbench",
    title: "Ready for you",
    text: "We take care of the materials and equipment—so you can stay fully immersed in the process.",
  },
  {
    src: "/assets/landing/sessionCard_5.png",
    alt: "An instructor guiding a child working with clay",
    title: "Guidance when needed",
    text: "Experienced instructors by your side—helping, correcting, and encouraging at every step.",
  },
  {
    src: "/assets/landing/sessionCard_6.png",
    alt: "An overhead view of hands shaping clay on a wheel",
    title: "Unhurried learning",
    text: "Small groups mean space to learn, ask, and create without pressure.",
  },
];

const EASE: [number, number, number, number] = [0.56, 0, 0.44, 1];

function getItemsPerView(): number {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 480px)").matches) return 2;
  return 1;
}

export default function SessionsCarousel() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalGroups = Math.ceil(CARDS.length / itemsPerView);

  // Sync itemsPerView with viewport; reset group on breakpoint change
  useEffect(() => {
    function update() {
      const next = getItemsPerView();
      setItemsPerView((prev) => {
        if (prev !== next) setCurrentGroup(0);
        return next;
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Pause when tab is not visible — prevents queued transitions on focus return
  useEffect(() => {
    function handleVisibility() {
      setIsPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Auto-advance — resets on every navigation or when paused state changes
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentGroup((g) => (g + 1) % totalGroups);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup, totalGroups, isPaused]);

  function navigate(dir: 1 | -1) {
    setCurrentGroup((g) => (g + dir + totalGroups) % totalGroups);
  }

  const allGroups = Array.from({ length: totalGroups }, (_, i) =>
    CARDS.slice(i * itemsPerView, (i + 1) * itemsPerView)
  );

  // Strip slides as a single unit: x is a % of strip width.
  // strip width = totalGroups * track width, so each group = 1/totalGroups of strip.
  // translateX(-(currentGroup/totalGroups)*100%) positions the correct group.
  const stripX = -(currentGroup / totalGroups) * 100;

  return (
    <div
      className={styles.carouselWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.carouselHeader}>
        <h2 id="sessions-heading" className={styles.heading}>
          Our pottery sessions
        </h2>
        <div className={styles.controls}>
          <button
            className={styles.arrowBtn}
            onClick={() => navigate(-1)}
            aria-label="Previous group"
          >
            <ChevronLeft size={16} aria-hidden="true" focusable="false" />
          </button>
          <button
            className={styles.arrowBtn}
            onClick={() => navigate(1)}
            aria-label="Next group"
          >
            <ChevronRight size={16} aria-hidden="true" focusable="false" />
          </button>
        </div>
      </div>

      <div className={styles.track}>
        <motion.div
          className={styles.strip}
          style={{ "--total-groups": totalGroups } as React.CSSProperties}
          animate={{ x: `${stripX}%` }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          {allGroups.map((cards, groupIndex) => (
            <div
              key={groupIndex}
              className={styles.group}
              aria-hidden={groupIndex !== currentGroup ? true : undefined}
            >
              {cards.map((card) => (
                <div key={card.src} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1024px) calc((100vw - 160px) / 3), (min-width: 480px) calc((100vw - 80px) / 2), calc(100vw - 48px)"
                      className={styles.cardImage}
                    />
                  </div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardText}>{card.text}</p>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
