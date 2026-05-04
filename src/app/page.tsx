import type { Metadata } from "next";
import Hero from "./_components/(landing)/Hero/Hero";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://claylabs.com.au",
  },
};

// Landing page — sections will be added here one at a time.
// Page flow: Hero → Problem → Solution → What We Do → Stages & Services
//            → Work/Concept → Testimonials → Footer

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
    </main>
  );
}
