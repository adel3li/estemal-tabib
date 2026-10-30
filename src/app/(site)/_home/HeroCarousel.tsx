"use client";

// Hero device card, cycling through the listed devices (featured first).
// Each slide shows what the seller declared, not the inspection report.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/lib/routes";
import { isListed, useDemo } from "@/lib/demo/store";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import type { Condition, Device } from "@/lib/demo/types";
import { artFor } from "./artMap";

const MAX_SLIDES = 5;
const INTERVAL_MS = 5000;

const COND_TONE: Record<Condition, { bg: string; fg: string }> = {
  a: { bg: "#E3F0ED", fg: "#0D5C55" },
  b: { bg: "#FBEEDC", fg: "#8A4209" },
  c: { bg: "#FBE3DC", fg: "#8A2A09" },
};

const ph = (x: string) => !x || x.startsWith("[");

function subtitle(d: Device) {
  const bm = [d.brand, d.model].filter((x) => !ph(x)).join(" ");
  return bm || "[الماركة / الموديل]";
}

export function HeroCarousel() {
  const { state } = useDemo();
  const listed = state.devices.filter(isListed);
  const slides = [...listed.filter((d) => d.featured), ...listed.filter((d) => !d.featured)].slice(0, MAX_SLIDES);
  const n = slides.length;

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const cur = n ? i % n : 0;

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [paused, n]);

  if (!n) return null;
  const go = (k: number) => setI(((k % n) + n) % n);
  const d = slides[cur];

  return (
    <div
      className="mn-hero-card"
      role="region"
      aria-roledescription="carousel"
      aria-label="أجهزة متاحة"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        // RTL: swiping left moves to the next slide.
        if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
      }}
      style={{ flex: "1 1 420px", minWidth: 0, maxWidth: 520, position: "relative" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: "18px -14px -14px 18px", borderRadius: 26, background: "#E3F0ED", border: "1px solid #C9DED8" }} />
      <div
        key={d.id}
        className="mn-slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${cur + 1} من ${n}`}
        style={{ position: "relative", background: "#FFFFFF", border: "1px solid #DCE3DF", borderRadius: 24, boxShadow: "0 24px 50px rgba(18, 34, 31, 0.10)", overflow: "hidden" }}
      >
        <Slide d={d} />
      </div>
      {n > 1 ? (
        <div style={{ position: "relative", marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <button type="button" className="mn-car-btn" onClick={() => go(cur - 1)} aria-label="الجهاز اللي قبله">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          {slides.map((s, k) => (
            <button key={s.id} type="button" className="mn-car-dot" onClick={() => go(k)} aria-label={`${s.title} (${k + 1} من ${n})`} aria-current={k === cur ? "true" : undefined}>
              <span />
            </button>
          ))}
          <button type="button" className="mn-car-btn" onClick={() => go(cur + 1)} aria-label="الجهاز اللي بعده">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, children, bg = "#F5F7F4" }: { label: string; children: React.ReactNode; bg?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: bg }}>
      <span style={{ flex: "none" }}>{label}</span>
      {children}
    </div>
  );
}

const chip = (bg: string, fg: string): React.CSSProperties => ({
  padding: "2px 10px",
  borderRadius: 999,
  background: bg,
  color: fg,
  fontWeight: 600,
  fontSize: 14,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

function Slide({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const tone = COND_TONE[d.condition];
  const defects = d.declaredDefects.trim();
  return (
    <>
      <div style={{ position: "relative", aspectRatio: "4 / 2.7", background: "#E7EDEA" }}>
        <svg role="img" aria-label={`رسم توضيحي ل${d.title}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%" }}><use href={artFor(d.type)} /></svg>
        {inspected ? (
          <svg aria-hidden="true" viewBox="0 0 120 120" style={{ position: "absolute", bottom: 14, left: 14, width: 84, height: 84, filter: "drop-shadow(0 6px 14px rgba(18, 34, 31, 0.18))" }}><use href="#mn-seal" /></svg>
        ) : null}
        {inspected ? (
          <span style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.18)" }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            تم الفحص
          </span>
        ) : (
          <span style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 999, background: "#FFFFFF", color: "#24508F", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.18)" }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
            يُفحص عند الطلب
          </span>
        )}
        <span style={{ position: "absolute", bottom: 14, right: 14, padding: "5px 10px", borderRadius: 999, background: "rgba(18, 34, 31, 0.68)", color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>
          {inspected ? "صورة حقيقية للجهاز من فريق الفحص" : "صورة من البايع"}
        </span>
      </div>
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, overflowWrap: "anywhere" }}>{d.title} — {subtitle(d)}</div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>{typeLabel(d.type)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#4A5A56", display: "flex", alignItems: "center", gap: 6 }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="4" /><path d="M3 20c.8-3.5 3.6-5.5 7-5.5" /><path d="M15 17l2 2 4-4" /></svg>
            بيانات الجهاز من البايع
          </div>
          <Row label="الحالة">
            <span style={chip(tone.bg, tone.fg)}>{CONDITIONS[d.condition].label}</span>
          </Row>
          <Row label="الملحقات">
            <span style={{ ...chip("#FFFFFF", "#3C4C48"), border: "1px solid #E5EBE8" }} title={d.accessories || undefined}>{d.accessories.trim() || "مفيش"}</span>
          </Row>
          <Row label="الصيانة">
            <span style={chip("#E3F0ED", "#0D5C55")}>{d.maintenanceMonths} شهور</span>
          </Row>
          {defects ? (
            <Row label="عيوب مُعلنة" bg="#FBEEDC">
              <span style={chip("#FFFFFF", "#8A4209")} title={defects}>{defects}</span>
            </Row>
          ) : (
            <Row label="عيوب مُعلنة">
              <span style={chip("#E3F0ED", "#0D5C55")}>مفيش</span>
            </Row>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid #E5EBE8" }}>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{fmt(d.price)} <span style={{ fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>ج.م</span></span>
          <Link href={routes.device(d.id)} className="mn-link44" style={{ fontWeight: 600, fontSize: 14 }}>شوف تفاصيل الجهاز ←</Link>
        </div>
      </div>
    </>
  );
}
