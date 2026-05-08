"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getLenis } from "../../(root)/SmoothScroll/SmoothScroll";
import PotteryForm from "./forms/PotteryForm";
import PrivateForm from "./forms/PrivateForm";
import KidsForm from "./forms/KidsForm";
import KilnForm from "./forms/KilnForm";
import styles from "./BookingSection.module.scss";

const TABS = [
  { id: "pottery", label: "Pottery classes" },
  { id: "private", label: "Private classes" },
  { id: "kids", label: "Kids classes" },
  { id: "kiln", label: "Kiln firing services" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BookingSection() {
  const searchParams = useSearchParams();
  const param = searchParams.get("tab") as TabId | null;
  const validTab: TabId =
    param && TABS.some((t) => t.id === param) ? param : "pottery";

  const [activeTab, setActiveTab] = useState<TabId>(validTab);

  // Sync active tab when the URL's `tab` param changes (e.g. deep-link CTA from KilnFiringSection).
  // Watch the string value, not the searchParams object, to avoid re-running on every render.
  const tabParam = searchParams.get("tab");
  useEffect(() => {
    const next: TabId =
      tabParam && TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : "pottery";
    setActiveTab(next);
  }, [tabParam]);

  // Scroll #book into view when arriving via a CTA deep-link (e.g. /?tab=kiln#book).
  // Uses lenis.scrollTo so the Lenis smooth-scroll engine handles the animation.
  // Falls back to native scrollIntoView when Lenis is absent (reduced-motion path).
  useEffect(() => {
    if (!tabParam) return;
    const timer = setTimeout(() => {
      const el = document.getElementById("book");
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [tabParam]);

  // Scroll active tab button into view horizontally within the strip.
  // Skips mount to avoid scrolling the page to the booking section on initial load.
  const isFirstTabMount = useRef(true);
  useEffect(() => {
    if (isFirstTabMount.current) {
      isFirstTabMount.current = false;
      return;
    }
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const btn = tabRefs.current[idx];
    if (!btn) return;
    const strip = btn.closest('[role="tablist"]') as HTMLElement | null;
    if (!strip) return;
    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const { scrollLeft, offsetWidth } = strip;
    if (btnLeft < scrollLeft) {
      strip.scrollTo({ left: btnLeft, behavior: "smooth" });
    } else if (btnRight > scrollLeft + offsetWidth) {
      strip.scrollTo({ left: btnRight - offsetWidth, behavior: "smooth" });
    }
  }, [activeTab]);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const el = tabRefs.current[idx];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    if (firstRender.current) {
      // Suppress transition on initial paint to avoid flash from 0
      indicator.style.transition = "none";
      indicator.style.left = `${el.offsetLeft}px`;
      indicator.style.width = `${el.offsetWidth}px`;
      firstRender.current = false;
      requestAnimationFrame(() => {
        if (indicatorRef.current) indicatorRef.current.style.transition = "";
      });
    } else {
      indicator.style.left = `${el.offsetLeft}px`;
      indicator.style.width = `${el.offsetWidth}px`;
    }
  }, [activeTab]);

  return (
    <section id="book" className={styles.section} aria-labelledby="booking-heading">
      <div className={styles.container}>
        <h2 id="booking-heading" className={styles.heading}>
          Book your session
        </h2>

        <div className={styles.tabStripWrapper}>
          <div
            className={styles.tabStrip}
            role="tablist"
            aria-label="Booking type"
          >
            <span ref={indicatorRef} className={styles.tabIndicator} aria-hidden="true" />
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`booking-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`booking-panel-${tab.id}`}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          key={activeTab}
          role="tabpanel"
          id={`booking-panel-${activeTab}`}
          aria-labelledby={`booking-tab-${activeTab}`}
          className={styles.tabPanel}
        >
          {activeTab === "pottery" && <PotteryForm />}
          {activeTab === "private" && <PrivateForm />}
          {activeTab === "kids" && <KidsForm />}
          {activeTab === "kiln" && <KilnForm />}
        </div>
      </div>
    </section>
  );
}
