"use client";

import { useState } from "react";
import { GOVERNORATES } from "@/lib/demo/labels";
import { bad, CardHead, grid, Msg, Star, type SectionProps } from "./ui";

type Geo = "idle" | "busy" | "error";

const GEO_ERRORS: Record<number, string> = {
  1: "مسموحش بالوصول لموقعك. فعّل الـ Location من إعدادات المتصفح، أو كفاية العنوان المكتوب.",
  2: "مقدرناش نحدد موقعك دلوقتي. جرّب تاني، أو كفاية العنوان المكتوب.",
  3: "تحديد الموقع خد وقت طويل. جرّب تاني.",
};

export function SectionContact({ f, set, err }: SectionProps) {
  const [geo, setGeo] = useState<Geo>("idle");
  const [geoMsg, setGeoMsg] = useState("");
  const hasLoc = typeof f.lat === "number" && typeof f.lng === "number";

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setGeo("error");
      setGeoMsg("المتصفح ده مش بيدعم تحديد الموقع. كفاية العنوان المكتوب.");
      return;
    }
    setGeo("busy");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo("idle");
        setGeoMsg("");
        set({ lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) });
      },
      (e) => {
        setGeo("error");
        setGeoMsg(GEO_ERRORS[e.code] ?? GEO_ERRORS[2]);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <fieldset id="sl-s1" className="sl-card">
      <CardHead
        iconBg="#E3F0ED"
        iconFg="#0D5C55"
        step="الخطوة ١ من ٦"
        stepFg="#0D5C55"
        title="١. بياناتك"
        icon={
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </>
        }
      />
      <div className="sl-body">
        <div style={grid(240)}>
          <label className="sl-field">
            <span>الاسم بالكامل<Star /></span>
            <input type="text" {...bad("fullName", err)} autoComplete="name" value={f.fullName} onChange={(e) => set({ fullName: e.target.value })} required />
            <Msg k="fullName" err={err} />
          </label>
          <label className="sl-field">
            <span>رقم الموبايل (واتساب)<Star /></span>
            <input type="tel" placeholder="01xxxxxxxxx" {...bad("phone", err)} dir="ltr" style={{ textAlign: "right" }} autoComplete="tel" inputMode="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} required />
            <Msg k="phone" err={err} />
          </label>
          <label className="sl-field">
            <span>المحافظة<Star /></span>
            <select {...bad("governorate", err)} value={f.governorate} onChange={(e) => set({ governorate: e.target.value })} required>
              {GOVERNORATES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <Msg k="governorate" err={err} />
          </label>
          <label className="sl-field">
            <span>عنوان استلام الجهاز للفحص<Star /></span>
            <input type="text" placeholder="العيادة أو البيت" {...bad("pickupAddress", err)} autoComplete="street-address" value={f.pickupAddress} onChange={(e) => set({ pickupAddress: e.target.value })} required />
            <Msg k="pickupAddress" err={err} />
          </label>
        </div>
        {!hasLoc ? (
          <div style={{ padding: "14px 16px", borderRadius: 16, border: "1.5px dashed #9CCBC2", background: "#F9FBFA", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <button type="button" onClick={locate} disabled={geo === "busy"} className="sl-loc" style={{ minHeight: 46, padding: "0 18px", borderRadius: 12, border: "1.5px solid #0D5C55", background: "#FFFFFF", color: "#0D5C55", font: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: geo === "busy" ? "progress" : "pointer" }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              {geo === "busy" ? "بنحدد موقعك…" : "حدّد موقعي"}
            </button>
            {geo === "error" ? (
              <span role="alert" style={{ flex: "1 1 240px", fontSize: 14, color: "#B3261E", fontWeight: 600 }}>
                {geoMsg}
              </span>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: "12px 16px", borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0B4A44", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 15 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
              <span style={{ width: 30, height: 30, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              تم تحديد موقعك
            </span>
            <span dir="ltr" style={{ fontSize: 13, color: "#3C4C48" }}>
              {f.lat}, {f.lng}
            </span>
            <a href={`https://www.google.com/maps?q=${f.lat},${f.lng}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
              شوفه على الخريطة
            </a>
            <button type="button" onClick={() => set({ lat: undefined, lng: undefined })} style={{ minHeight: 36, padding: "0 12px", border: 0, background: "transparent", color: "#0B4A44", font: "inherit", textDecoration: "underline", cursor: "pointer" }}>
              غيّر
            </button>
          </div>
        )}
      </div>
    </fieldset>
  );
}
