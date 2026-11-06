"use client";

// Home hero, v2 look (design-explorations/v2/src/home.html, brand theme) with
// the content of the Main.dc.html port: badge, lede, two buttons, the three
// promises, and the device carousel. Each slide shows what the seller declared
// (client feedback) — not the inspection report.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/lib/routes";
import { BUSINESS, MAINT_SPAN, monthsAr } from "@/config/business";
import { isListed } from "@/lib/demo/store";
import { usePublicDevices } from "@/lib/public/seed";
import { DevicePic } from "@/components/site/DevicePic";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { DrawnUnderline } from "./DrawnUnderline";
import { artFor } from "./artMap";

const DAYS = BUSINESS.trialDays;
const MAINT_MAX = BUSINESS.maintenanceMonthsOptions[BUSINESS.maintenanceMonthsOptions.length - 1];
const MAX_SLIDES = 5;
const INTERVAL_MS = 5000;

const ph = (x: string) => !x || x.startsWith("[");
const subtitle = (d: Device) => [d.brand, d.model].filter((x) => !ph(x)).join(" ") || "[الماركة / الموديل]";

export function Hero() {
  return (
    <section className="hm-hero">
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <div className="hm-eyebrow">منصة متخصصة 100% في أجهزة الأسنان المستعملة</div>
          <h1 className="hm-h1">
            من طبيب أسنان
            <br />
            لطبيب أسنان…{" "}
            <span className="hm-h1-em">
              بثقة
              <DrawnUnderline />
            </span>
          </h1>
          <p className="hm-lede">
            اشتري أو بيع أجهزة عيادتك المستعملة من غير قلق. كل جهاز بيتفحص بواسطة فني معتمد، وفلوسك بتفضل محفوظة معانا {DAYS} أيام بعد ما تستلم الجهاز وتجربه بنفسك.
          </p>
          <div className="hm-ctas">
            <Link href={routes.devices} className="hm-btn hm-btn-white">
              اشتري جهاز <span aria-hidden="true">←</span>
            </Link>
            <Link href={routes.sell} className="hm-btn hm-btn-orange">بيع جهازك</Link>
          </div>
          <dl className="hm-facts">
            <div><dt>فحص فني</dt><dd>بواسطة فني معتمد</dd></div>
            <div><dt>{DAYS} أيام</dt><dd>فلوسك محفوظة لمدة {DAYS} أيام</dd></div>
            <div><dt>حتى {monthsAr(MAINT_MAX)}</dt><dd>صيانة {MAINT_SPAN}</dd></div>
          </dl>
        </div>
        <HeroCarousel />
      </div>
    </section>
  );
}

function HeroCarousel() {
  const { devices, ready } = usePublicDevices();
  const listed = devices.filter(isListed);
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

  // Keep the card's space while the listings load, so the page doesn't jump.
  if (!n) return ready ? null : <div className="hm-cert hm-cert-ph" aria-hidden="true" style={{ minHeight: 520 }} />;
  const go = (k: number) => setI(((k % n) + n) % n);
  const d = slides[cur];

  return (
    <div
      className="hm-car"
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
    >
      <div key={d.id} className="hm-cert mn-slide" role="group" aria-roledescription="slide" aria-label={`${cur + 1} من ${n}`}>
        <Slide d={d} />
      </div>
      {n > 1 ? (
        <div className="hm-car-nav">
          <button type="button" className="hm-car-btn" onClick={() => go(cur - 1)} aria-label="الجهاز اللي قبله">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          {slides.map((s, k) => (
            <button key={s.id} type="button" className="hm-car-dot" onClick={() => go(k)} aria-label={`${s.title} (${k + 1} من ${n})`} aria-current={k === cur ? "true" : undefined}>
              <span />
            </button>
          ))}
          <button type="button" className="hm-car-btn" onClick={() => go(cur + 1)} aria-label="الجهاز اللي بعده">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Slide({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const defects = d.declaredDefects.trim();
  const rows: { label: string; value: string; warn?: boolean }[] = [
    { label: "الحالة", value: CONDITIONS[d.condition].label, warn: d.condition !== "a" },
    { label: "الملحقات", value: d.accessories.trim() || "مفيش" },
    { label: "الصيانة", value: monthsAr(d.maintenanceMonths) },
    { label: "عيوب مُعلنة", value: defects || "مفيش", warn: !!defects },
  ];

  return (
    <>
      <div className="hm-cert-top">
        <b>بيانات الجهاز من البايع</b>
        <span className={inspected ? "hm-status hm-ok hm-status-top" : "hm-status hm-ord hm-status-top"}>
          <span className="hm-d" aria-hidden="true" />
          {inspected ? "تم الفحص" : "يُفحص عند الطلب"}
        </span>
      </div>
      <div className="hm-cert-dev">
        <span className="hm-ph hm-car-ph">
          <DevicePic src={d.photos?.[0]} art={artFor(d.type)} label={d.photos?.[0] ? d.title : `رسم توضيحي ل${d.title}`} />
        </span>
        <div>
          <h2 className="hm-cert-title">{d.title} — {subtitle(d)}</h2>
          <div className="hm-meta">{typeLabel(d.type)}</div>
          <div className="hm-meta hm-car-cap">{inspected ? "صورة حقيقية للجهاز من فريق الفحص" : "صورة من البايع"}</div>
        </div>
      </div>
      <ul className="hm-rows hm-car-data">
        {rows.map((row) => (
          <li key={row.label} className="hm-row">
            <span>{row.label}</span>
            <span className={row.warn ? "hm-grade hm-grade-note" : "hm-grade"} title={row.value}>{row.value}</span>
          </li>
        ))}
      </ul>
      <div className="hm-cert-foot">
        <div>
          <div className="hm-price hm-car-price"><span className="hm-num">{fmt(d.price)}</span> <small>ج.م</small></div>
          <Link href={routes.device(d.id)} className="hm-tlink">شوف تفاصيل الجهاز <span aria-hidden="true">←</span></Link>
        </div>
        {inspected ? (
          <div className="hm-stamp" aria-hidden="true">
            <div><b>تم<br />الفحص</b></div>
          </div>
        ) : null}
      </div>
    </>
  );
}
