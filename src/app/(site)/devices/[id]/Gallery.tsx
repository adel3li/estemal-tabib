"use client";

import { useState } from "react";
import type { Device, DeviceType } from "@/lib/demo/types";
import { defectInfo, svgProps } from "./helpers";

type Slide = { ref: string; label: string; video?: boolean; defect?: boolean };

/** Same type → art mapping as the cards in «كل الأجهزة» (symbols from ../art.tsx). */
const TYPE_ART: Record<DeviceType, string> = {
  unit: "#br-unit", xray: "#br-xray", autoclave: "#br-autoclave", surg: "#br-surg", endo: "#br-rotary",
  apex: "#br-apex", cure: "#br-cure", rotary: "#br-rotary", contra: "#br-contra", micro: "#br-micro",
  iocam: "#br-iocam", cam: "#br-iocam", loupe: "#br-loupe", other: "#br-unit",
};

function slidesFor(d: Device): Slide[] {
  const { count } = defectInfo(d);
  if (d.inspection === "inspected") {
    if (d.type === "unit") {
      return [
        { ref: "#li-front", label: "صورة أمامية لليونيت" },
        { ref: "#li-recline", label: "الكرسي وهو مفرود" },
        { ref: "#li-tray", label: "ترابيزة الأدوات والخطوط" },
        ...(count ? [{ ref: "#li-defect", label: "صورة العيب", defect: true }] : []),
        { ref: "#li-light", label: "فيديو وهو شغال", video: true },
      ];
    }
    const art = TYPE_ART[d.type];
    return [
      { ref: art, label: `صورة ${d.title}` },
      ...(count ? [{ ref: art, label: "صورة العيب", defect: true }] : []),
      { ref: art, label: "فيديو وهو شغال", video: true },
    ];
  }
  if (d.type === "autoclave") {
    return [
      { ref: "#oo-front", label: "صورة أمامية" },
      { ref: "#oo-open", label: "الباب مفتوح" },
      { ref: "#oo-panel", label: "لوحة التحكم" },
      { ref: "#oo-side", label: "فيديو الجهاز", video: true },
    ];
  }
  const art = TYPE_ART[d.type];
  return [
    { ref: art, label: `صورة ${d.title}` },
    { ref: art, label: "فيديو الجهاز", video: true },
  ];
}

const pic = { display: "block", width: "100%", height: "100%" } as const;

export function Gallery({ d }: { d: Device }) {
  const [i, setI] = useState(0);
  const slides = slidesFor(d);
  const s = slides[Math.min(i, slides.length - 1)];
  const inspected = d.inspection === "inspected";
  const caption = defectInfo(d).caption;
  const cols = inspected ? 5 : 4;

  return (
    <>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#E7EDEA", border: "1px solid #DCE3DF", aspectRatio: "4 / 3" }}>
        {s.video ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <svg role="img" aria-label={inspected ? "فيديو وهو شغال" : "فيديو الجهاز وهو شغال"} viewBox="0 0 400 300" style={pic}><use href={s.ref} /></svg>
            <div style={{ position: "absolute", inset: 0, background: "rgba(15, 42, 38, 0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#FFFFFF" }}>
              <span style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(255, 255, 255, 0.95)", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span style={{ fontWeight: 600 }}>{inspected ? "فيديو وهو شغال" : "فيديو الجهاز وهو شغال · 0:42"}</span>
            </div>
          </div>
        ) : (
          <svg role="img" aria-label={s.label} viewBox="0 0 400 300" style={pic}><use href={s.ref} /></svg>
        )}

        {inspected ? (
          <span style={{ position: "absolute", top: 16, right: 16, padding: "7px 14px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.18)" }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" {...svgProps} strokeWidth={2.2}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>تم الفحص
          </span>
        ) : (
          <span style={{ position: "absolute", top: 16, right: 16, padding: "7px 14px", borderRadius: 999, background: "#FFFFFF", color: "#24508F", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.12)" }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" {...svgProps} strokeWidth={2}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>يُفحص عند الطلب
          </span>
        )}
        <span style={{ position: "absolute", top: 16, left: 16, padding: "6px 12px", borderRadius: 999, background: "rgba(18, 34, 31, 0.72)", color: "#FFFFFF", fontSize: 13, fontWeight: 600 }}>
          {slides.indexOf(s) + 1} / {slides.length}
        </span>

        {!inspected ? (
          <span className="li-cap" style={{ position: "absolute", bottom: 16, right: 16, left: 16, padding: "10px 14px", borderRadius: 12, background: "rgba(255, 255, 255, 0.95)", color: "#24508F", fontSize: 14, fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...svgProps} strokeWidth={1.8} style={{ flex: "none" }}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></svg>
            الصور والفيديو من البايع. فريقنا هيصوّر الجهاز ويفحصه بعد طلبك.
          </span>
        ) : s.defect ? (
          <span className="li-cap" style={{ position: "absolute", bottom: 16, right: 16, left: 16, padding: "10px 14px", borderRadius: 12, background: "#FDF6EC", border: "1px solid #F0C88A", color: "#6B3A10", fontSize: 14, fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
            <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 999, background: "#F2A33A", color: "#12221F", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontWeight: 700, fontSize: 13 }}>!</span>
            {caption}
          </span>
        ) : !s.video ? (
          <span className="li-cap" style={{ position: "absolute", bottom: 16, right: 16, left: 16, padding: "10px 14px", borderRadius: 12, background: "rgba(255, 255, 255, 0.95)", color: "#0B4A44", fontSize: 14, fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...svgProps} strokeWidth={1.8} style={{ flex: "none" }}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
            صورة حقيقية للجهاز — تصوير فريق الفحص
          </span>
        ) : null}
      </div>

      <div className="li-thumbs" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {slides.map((t, k) => {
          const on = t === s;
          const bd = on ? (t.defect ? "#C46A12" : "#0D5C55") : t.defect ? "#F0C88A" : "transparent";
          return (
            <button
              key={k}
              type="button"
              className="li-thumb"
              onClick={() => setI(k)}
              aria-label={t.label}
              aria-pressed={on}
              style={{ position: "relative", padding: 0, borderRadius: 14, overflow: "hidden", border: `2px solid ${bd}`, background: "#E7EDEA", cursor: "pointer", aspectRatio: "4 / 3" }}
            >
              <svg aria-hidden="true" viewBox="0 0 400 300" style={pic}><use href={t.ref} /></svg>
              {t.video && inspected ? (
                <span style={{ position: "absolute", inset: 0, background: "rgba(15, 42, 38, 0.5)", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "92%" }}>فيديو وهو شغال</span>
                </span>
              ) : null}
              {t.video && !inspected ? (
                <span style={{ position: "absolute", inset: 0, background: "rgba(15, 42, 38, 0.45)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              ) : null}
              {t.defect ? (
                <span style={{ position: "absolute", bottom: 0, right: 0, left: 0, padding: "2px 4px", background: "#FBEEDC", color: "#8A4209", fontSize: 12, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>صورة العيب</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}
