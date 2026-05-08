"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
