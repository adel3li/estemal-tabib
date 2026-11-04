"use client";

// «أحدث الأجهزة» — v2 card style. Filter logic from Main.dc.html #listings;
// items come from the demo store (listed, featured first).
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { isListed, useDemo } from "@/lib/demo/store";
import { fmt, typeLabel } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { artFor } from "./artMap";

const SHOW = 4;

const FILTERS: [string, (d: Device) => boolean][] = [
  ["الكل", () => true],
  ["تم الفحص فقط", (d) => d.inspection === "inspected"],
  ["يونيت", (d) => d.type === "unit"],
  ["أشعة", (d) => d.type === "xray"],
  ["تعقيم", (d) => d.type === "autoclave"],
  ["إندو وجراحة", (d) => ["endo", "apex", "cure", "surg"].includes(d.type)],
];

const ph = (x: string) => !x || x.startsWith("[");

export function Featured() {
  const { state } = useDemo();
  const [cur, setCur] = useState(0);

  const listed = state.devices.filter(isListed);
  const ordered = [...listed.filter((d) => d.featured), ...listed.filter((d) => !d.featured)];
  const shown = ordered.filter(FILTERS[cur][1]).slice(0, SHOW);

  return (
    <section id="listings" className="hm-sec">
      <div className="hm-wrap">
        <div className="hm-sec-head">
          <div>
            <div className="hm-eyebrow">متاح دلوقتي</div>
            <h2 className="hm-h2">أحدث الأجهزة</h2>
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
        {shown.length ? (
          <div className="hm-grid4" aria-live="polite">
            {shown.map((d) => (
              <DeviceCard key={d.id} d={d} />
            ))}
          </div>
        ) : (
          <p className="hm-empty" aria-live="polite">مفيش أجهزة في القسم ده دلوقتي.</p>
        )}
      </div>
    </section>
  );
}

function DeviceCard({ d }: { d: Device }) {
  const insp = d.inspection === "inspected";
  const spec = [ph(d.year) ? "" : d.year, d.governorate].filter(Boolean).join(" · ");
  return (
    <Link href={routes.device(d.id)} className="hm-card">
      <span className="hm-ph hm-card-ph">
        <svg role="img" aria-label={`رسم توضيحي ل${d.title}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <use href={artFor(d.type)} />
        </svg>
        <span className="hm-code hm-num">{d.id}</span>
      </span>
      <h3 className="hm-card-title">{d.title}</h3>
      <div className="hm-spec">{spec || typeLabel(d.type)} · صيانة {d.maintenanceMonths} شهور</div>
      <div className="hm-price">
        <span className="hm-num">{fmt(d.price)}</span> <small>ج.م</small>
      </div>
      <div className={insp ? "hm-status hm-ok" : "hm-status hm-ord"}>
        <span className="hm-d" aria-hidden="true" />
        {insp ? "تم الفحص" : "يُفحص عند الطلب"}
        <em>{insp ? "فيه تقرير" : "قبل الشحن"}</em>
      </div>
    </Link>
  );
}
