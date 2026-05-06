import type { Metadata } from "next";
import Hero from "./_components/(landing)/Hero/Hero";
import SessionsSection from "./_components/(landing)/SessionsSection/SessionsSection";
import BookingSection from "./_components/(landing)/BookingSection/BookingSection";
import VisualBreak from "./_components/(landing)/VisualBreak/VisualBreak";
import Footer from "./_components/(root)/Footer/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://claylabs.com.au",
  },
};

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <SessionsSection />
        <BookingSection />
      </main>
      <VisualBreak />
      <Footer />
    </>
  );
}
