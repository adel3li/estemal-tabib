"use client";

import { useEffect, useRef, useState } from "react";
import type { Device } from "@/lib/demo/types";
import { fmt } from "@/lib/demo/labels";
import { waLink } from "@/lib/whatsapp";
import { orderMessage } from "./helpers";

/**
 * Phones only (CSS shows it < 768px): a slim fixed bar with the price and the
 * order button. Hidden while the price card's own buttons are on screen, and
 * once the page's end (footer) comes into view, so it never covers them.
 */
export function OrderBar({ d }: { d: Device }) {
  const endRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const unavailable = d.status === "reserved" || d.status === "sold";

  useEffect(() => {
    const cta = document.getElementById("li-order-actions");
    const end = endRef.current;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) setCtaVisible(e.isIntersecting);
        // «at end» = the sentinel is on screen or already scrolled past (above).
        if (e.target === end) setAtEnd(e.isIntersecting || e.boundingClientRect.top < 0);
      }
    });
    if (cta) io.observe(cta);
    if (end) io.observe(end);
    return () => io.disconnect();
  }, []);

  const hidden = ctaVisible || atEnd;

  return (
    <>
      <div ref={endRef} aria-hidden="true" style={{ height: 1 }} />
      <div className={hidden ? "li-bar is-hidden" : "li-bar"} aria-hidden={hidden ? true : undefined}>
        <span className="li-bar-price">
          {fmt(d.price)} <span style={{ fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>ج.م</span>
        </span>
        {unavailable ? (
          <span className="li-bar-btn is-off" role="status">{d.status === "sold" ? "اتباع" : "محجوز دلوقتي"}</span>
        ) : (
          <a href={waLink(orderMessage(d))} target="_blank" rel="noopener noreferrer" className="li-bar-btn" tabIndex={hidden ? -1 : undefined}>
            اطلب الجهاز
          </a>
        )}
      </div>
    </>
  );
}
