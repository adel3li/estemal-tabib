"use client";

// «أحدث الأجهزة» — v2 card style. Filter logic from Main.dc.html #listings;
// items come from the demo store (listed, featured first).
import { monthsAr } from "@/config/business";
import Link from "next/link";
import { DevicePic } from "@/components/site/DevicePic";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { isListed } from "@/lib/demo/store";
import { usePublicDevices } from "@/lib/public/seed";
import { fmt, typeLabel } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { artFor } from "./artMap";
import { OldPrice } from "@/components/site/Price";
import { SaveHeart } from "@/components/site/SaveButton";

const SHOW = 4;

const countText = (n: number) => (n === 1 ? "جهاز واحد" : n === 2 ? "جهازين" : `${n} أجهزة`);

const FILTERS: [string, (d: Device) => boolean][] = [
  ["الكل", () => true],
  ["تم الفحص فقط", (d) => d.inspection === "inspected"],
  ["يونيت", (d) => d.type === "unit"],
  ["أشعة", (d) => d.type === "xray"],
  ["تعقيم", (d) => d.type === "autoclave"],
  ["إندو وجراحة", (d) => ["endo", "apex", "cure", "surg"].includes(d.type)],
];

export function Featured() {
  const { devices } = usePublicDevices();
  const [cur, setCur] = useState(0);

  const listed = devices.filter(isListed);
  const ordered = [...listed.filter((d) => d.featured), ...listed.filter((d) => !d.featured)];
  const shown = ordered.filter(FILTERS[cur][1]).slice(0, SHOW);

  return (
    <section id="listings" className="hm-sec">
      <div className="hm-wrap">
        <div className="hm-sec-head">
          <div>
            <div className="hm-eyebrow">متاح دلوقتي</div>
            <h2 className="hm-h2">أجهزة متاحة دلوقتي</h2>
          </div>
          <Link href={routes.devices} className="hm-tlink">كل الأجهزة <span aria-hidden="true">←</span></Link>
        </div>
        <div className="hm-tabs" role="group" aria-label="تصفية الأجهزة">
          {FILTERS.map(([label], k) => (
            <button key={label} type="button" aria-pressed={k === cur} onClick={() => setCur(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="hm-count" aria-live="polite">{countText(shown.length)}</div>
        {shown.length ? (
          <div className="hm-grid4">
            {shown.map((d) => (
              <DeviceCard key={d.id} d={d} />
            ))}
          </div>
        ) : (
          <p className="hm-empty">مفيش أجهزة في القسم ده دلوقتي.</p>
        )}
      </div>
    </section>
  );
}

export function DeviceCard({ d }: { d: Device }) {
  const insp = d.inspection === "inspected";
  return (
    <div className="card-wrap">
    <SaveHeart deviceId={d.id} title={d.title} />
    <Link href={routes.device(d.id)} className="hm-card">
      <span className="hm-ph hm-card-ph">
        <DevicePic src={d.photos?.[0]} art={artFor(d.type)} label={d.photos?.[0] ? d.title : `رسم توضيحي ل${d.title}`} />
        <span className="hm-code hm-num">{d.id}</span>
        {insp ? null : <span className="hm-photo-tag">صورة من البايع</span>}
      </span>
      <h3 className="hm-card-title">{d.title}</h3>
      {/* No year or location on cards (client feedback). */}
      <div className="hm-spec">{typeLabel(d.type)}</div>
      <div className="hm-pill">ضمان + صيانة {monthsAr(d.maintenanceMonths)}</div>
      <OldPrice d={d} />
      <div className="hm-price">
        <span className="hm-num">{fmt(d.price)}</span> <small>ج.م</small>
      </div>
      <div className={insp ? "hm-status hm-ok" : "hm-status hm-ord"}>
        <span className="hm-d" aria-hidden="true" />
        {insp ? "تم الفحص" : "يُفحص عند الطلب"}
        <em>{insp ? "فيه تقرير" : "قبل الشحن"}</em>
      </div>
    </Link>
    </div>
  );
}
