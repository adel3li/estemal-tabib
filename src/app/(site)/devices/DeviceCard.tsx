import Link from "next/link";
import type { Device, DeviceType } from "@/lib/demo/types";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";

/** Store type → Browse.dc.html symbol. Types without their own art borrow the closest one. */
const IMG: Record<DeviceType, string> = {
  unit: "#br-unit",
  xray: "#br-xray",
  autoclave: "#br-autoclave",
  surg: "#br-surg",
  endo: "#br-rotary",
  apex: "#br-apex",
  cure: "#br-cure",
  rotary: "#br-rotary",
  contra: "#br-contra",
  micro: "#br-micro",
  iocam: "#br-iocam",
  cam: "#br-iocam",
  loupe: "#br-loupe",
  other: "#br-unit",
};

const svg = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function DeviceCard({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  return (
    <Link
      href={routes.device(d.id)}
      className="br-card"
      style={{ display: "flex", flexDirection: "column", borderRadius: 22, border: "1px solid #DCE3DF", background: "#FFFFFF", overflow: "hidden", color: "#12221F", boxShadow: "0 4px 14px rgba(18, 34, 31, 0.04)" }}
    >
      <div className="br-img" style={{ position: "relative", aspectRatio: "4 / 3", background: "#E7EDEA", overflow: "hidden" }}>
        <svg role="img" aria-label={d.title} viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}>
          <use href={IMG[d.type]} />
        </svg>
        {inspected ? (
          <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 11px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.18)" }}>
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" {...svg} strokeWidth={2.6}><path d="M5 12l4 4 10-10" /></svg>تم الفحص
          </span>
        ) : (
          <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 11px", borderRadius: 999, background: "#E6EDF7", color: "#24508F", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(18, 34, 31, 0.12)" }}>
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" {...svg} strokeWidth={2.4}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>يُفحص عند الطلب
          </span>
        )}
        <span className="br-photo-tag" style={{ position: "absolute", bottom: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(255, 255, 255, 0.92)", color: "#3C4C48", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" {...svg} strokeWidth={2}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
          {inspected ? "صورة من فريق الفحص" : "صورة من البايع"}
        </span>
      </div>
      <div className="br-body" style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div className="br-name" style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.45 }}>{d.title}</div>
        <div style={{ fontSize: 13, color: "#4A5A56" }}>{typeLabel(d.type)}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={{ padding: "2px 10px", borderRadius: 999, background: "#F5F7F4", border: "1px solid #E5EBE8", fontSize: 12, fontWeight: 600, color: "#3C4C48" }}>الحالة: {CONDITIONS[d.condition].short}</span>
          <span style={{ padding: "2px 10px", borderRadius: 999, background: "#E3F0ED", fontSize: 12, fontWeight: 600, color: "#0D5C55", display: "flex", alignItems: "center", gap: 4 }}>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" {...svg} strokeWidth={2}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></svg>
            صيانة {d.maintenanceMonths} شهور
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid #E5EBE8", marginTop: "auto" }}>
          <span className="br-price" style={{ fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: "#12221F" }}>
            {fmt(d.price)} <span style={{ fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>ج.م</span>
          </span>
          <span className="br-more" style={{ padding: "6px 12px", borderRadius: 10, background: "#E3F0ED", fontSize: 13, color: "#0D5C55", fontWeight: 700, whiteSpace: "nowrap" }}>التفاصيل ←</span>
        </div>
      </div>
    </Link>
  );
}
