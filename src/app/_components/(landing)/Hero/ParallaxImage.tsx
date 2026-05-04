"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Hero.module.scss";

export default function ParallaxImage() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const wrapper = inner?.parentElement;
    if (!inner || !wrapper) return;

    // Respect user's motion preference
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;

      // Shift up to 25px as the section enters and exits the viewport
      const progress = rect.top / vh;
      inner.style.transform = `translateY(${progress * 25}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={innerRef} className={styles.parallaxInner}>
      <Image
        src="/assets/landing/heroImg.png"
        alt="Handcrafted pottery and ceramics arranged on stone slabs"
        fill
        priority
        quality={85}
        sizes="(max-width: 480px) calc(100vw - 48px), (max-width: 768px) calc(100vw - 64px), calc(100vw - 128px)"
        className={styles.image}
      />
    </div>
  );
}
