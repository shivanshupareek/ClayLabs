import type { Metadata } from "next";
import NotFoundClient from "./NotFoundClient";
import Footer from "./_components/(root)/Footer/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://claylabs.com.au/404",
  },
};

export default function NotFound() {
  return (
    <>
      <NotFoundClient />
      <Footer />
    </>
  );
}
