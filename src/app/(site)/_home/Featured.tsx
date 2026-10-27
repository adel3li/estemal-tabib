"use client";

// «أجهزة متاحة دلوقتي» — Main.dc.html #listings. Chip logic ported from the
// design's <script>; items come from the demo store (listed, featured first).
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { isListed, useDemo } from "@/lib/demo/store";
import { fmt } from "@/lib/demo/labels";
import type { Device, DeviceType } from "@/lib/demo/types";

const SHOW = 4;

const FILTERS: [string, (d: Device) => boolean][] = [
  ["الكل", () => true],
  ["تم الفحص فقط", (d) => d.inspection === "inspected"],
  ["يونيت", (d) => d.type === "unit"],
  ["أشعة", (d) => d.type === "xray"],
  ["تعقيم", (d) => d.type === "autoclave"],
  ["إندو وجراحة", (d) => ["endo", "apex", "cure", "surg"].includes(d.type)],
];

/** Which of the page's illustrations to use for a device type. */
const ART: Partial<Record<DeviceType, string>> = {
  unit: "#mn-unit",
  autoclave: "#mn-autoclave",
  xray: "#mn-xray",
  endo: "#mn-endo",
  apex: "#mn-endo",
  cure: "#mn-endo",
  surg: "#mn-endo",
  rotary: "#mn-endo",
  contra: "#mn-endo",
  micro: "#mn-endo",
};

const countText = (n: number) => (n === 1 ? "جهاز واحد" : n === 2 ? "جهازين" : `${n} أجهزة`);

export function Featured() {
  const { state } = useDemo();
  const [cur, setCur] = useState(0);

  const listed = state.devices.filter(isListed);
  const ordered = [...listed.filter((d) => d.featured), ...listed.filter((d) => !d.featured)];
  const shown = ordered.filter(FILTERS[cur][1]).slice(0, SHOW);

  return (
    <section id="listings" style={{ background: "#FFFFFF", borderTop: "1px solid #E5EBE8", borderBottom: "1px solid #E5EBE8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "76px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>أجهزة متاحة دلوقتي</h2>
          <Link href={routes.devices} style={{ fontWeight: 600 }}>شوف كل الأجهزة ←</Link>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }} role="group" aria-label="تصفية الأجهزة">
            {FILTERS.map(([label], k) => {
              const on = k === cur;
              return (
                <button
                  key={label}
                  type="button"
                  className="mn-chip"
                  onClick={() => setCur(k)}
                  aria-pressed={on}
                  style={{
                    minHeight: 44,
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`,
                    background: on ? "#0D5C55" : "#FFFFFF",
                    color: on ? "#FFFFFF" : "#12221F",
                    font: "inherit",
                    fontWeight: on ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span aria-live="polite" style={{ fontSize: 14, color: "#4A5A56" }}>{countText(shown.length)}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
          {shown.map((d) => (
            <DeviceCard key={d.id} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCard({ d }: { d: Device }) {
  const insp = d.inspection === "inspected";
  return (
    <Link href={routes.device(d.id)} className="mn-card" style={{ display: "flex", flexDirection: "column", borderRadius: 20, border: "1px solid #DCE3DF", background: "#FFFFFF", overflow: "hidden", color: "#12221F", boxShadow: "0 4px 14px rgba(18, 34, 31, 0.04)" }}>
      <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#E7EDEA" }}>
        <svg role="img" aria-label={`رسم توضيحي ل${d.title}`} viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}>
          <use href={ART[d.type] ?? "#mn-tools"} />
        </svg>
        {insp ? (
          <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.15)" }}>
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            تم الفحص
          </span>
        ) : (
          <>
            <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 999, background: "#FFFFFF", color: "#24508F", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.15)" }}>
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
              يُفحص عند الطلب
            </span>
            <span style={{ position: "absolute", bottom: 10, right: 10, padding: "3px 9px", borderRadius: 999, background: "rgba(18, 34, 31, 0.68)", color: "#FFFFFF", fontSize: 11, fontWeight: 600 }}>صورة من البايع</span>
          </>
        )}
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 17 }}>{d.title}</div>
        <div style={{ fontSize: 13, color: "#4A5A56", display: "flex", alignItems: "center", gap: 4 }}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
          {d.year} · {d.governorate}
        </div>
        <div style={{ alignSelf: "flex-start", padding: "2px 10px", borderRadius: 999, background: "#E3F0ED", fontSize: 12, color: "#0D5C55", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
          ضمان + صيانة {d.maintenanceMonths} شهور
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #E5EBE8", marginTop: "auto" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{fmt(d.price)} ج.م</span>
          <span className="mn-more" style={{ fontSize: 13, color: "#0D5C55", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            التفاصيل<span aria-hidden="true">←</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
