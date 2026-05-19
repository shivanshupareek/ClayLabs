import type { Metadata } from "next";
import { Suspense } from "react";
import Hero from "./_components/(landing)/Hero/Hero";
import SessionsSection from "./_components/(landing)/SessionsSection/SessionsSection";
import PrivateClassesSection from "./_components/(landing)/PrivateClassesSection/PrivateClassesSection";
import KidsClassesSection from "./_components/(landing)/KidsClassesSection/KidsClassesSection";
import KilnFiringSection from "./_components/(landing)/KilnFiringSection/KilnFiringSection";
import BookingSection from "./_components/(landing)/BookingSection/BookingSection";
import VisualBreak from "./_components/(landing)/VisualBreak/VisualBreak";
import Footer from "./_components/(root)/Footer/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://clayora.com.au",
  },
};

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <Suspense fallback={null}>
          <BookingSection />
        </Suspense>
        <SessionsSection />
        <PrivateClassesSection />
        <KidsClassesSection />
        <KilnFiringSection />
      </main>
      {/* <VisualBreak /> */}
      <Footer />
    </>
  );
}
