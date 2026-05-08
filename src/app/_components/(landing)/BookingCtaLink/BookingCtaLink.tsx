"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLenis } from "../../(root)/SmoothScroll/SmoothScroll";

interface Props {
  tab: string;
  label: string;
  className: string;
  labelClassName: string;
  arrowClassName: string;
}

export default function BookingCtaLink({
  tab,
  label,
  className,
  labelClassName,
  arrowClassName,
}: Props) {
  function handleClick() {
    // Fire on every click — including repeat clicks to the same URL where
    // tabParam doesn't change and BookingSection's useEffect won't re-fire.
    setTimeout(() => {
      const el = document.getElementById("book");
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }

  return (
    <Link
      href={`/?tab=${tab}#book`}
      scroll={false}
      className={className}
      onClick={handleClick}
    >
      <span className={labelClassName}>{label}</span>
      <span className={arrowClassName} aria-hidden="true">
        <ArrowRight size={14} focusable={false} />
      </span>
    </Link>
  );
}
