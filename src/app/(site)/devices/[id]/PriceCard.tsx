import Link from "next/link";
import { BUSINESS } from "@/config/business";
import type { Device } from "@/lib/demo/types";
import { fmt, typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { askMessage, brandModel, orderMessage, svgProps } from "./helpers";

const ic = (w = 22) => ({ "aria-hidden": true, width: w, height: w, viewBox: "0 0 24 24", ...svgProps, strokeWidth: 1.8 }) as const;
const pill = { padding: "2px 10px", borderRadius: 999, background: "#F5F7F4", fontSize: 12, fontWeight: 600, color: "#3C4C48" } as const;
const tile = { padding: "12px 6px", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } as const;
const wRow = { padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E5EBE8" } as const;

export function PriceCard({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const days = BUSINESS.trialDays;
  const unavailable = d.status === "reserved" || d.status === "sold";
  const subtitle = brandModel(d);

  return (
    <div style={{ padding: 26, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={pill}>{typeLabel(d.type)}</span>
          <span style={{ ...pill, display: "flex", alignItems: "center", gap: 4 }}>
            <svg {...ic(12)} strokeWidth={2}><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
            {d.governorate}
          </span>
          {inspected ? (
            <span style={{ ...pill, background: "#E3F0ED", fontWeight: 700, color: "#0D5C55", display: "flex", alignItems: "center", gap: 4 }}>
              <svg {...ic(12)} strokeWidth={2.6}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>تم الفحص
            </span>
          ) : null}
        </div>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.35 }}>{d.title} — {subtitle}</h1>
        {inspected ? (
          <div style={{ color: "#4A5A56", fontSize: 15 }}>سنة الصنع {d.year} · بلد المنشأ {d.origin} · الجهاز في {d.governorate}</div>
        ) : null}
      </div>

      {unavailable ? (
        <div role="status" style={{ padding: "10px 14px", borderRadius: 12, background: d.status === "sold" ? "#F5F7F4" : "#FBEEDC", border: `1px solid ${d.status === "sold" ? "#C9D4CF" : "#F0C88A"}`, color: d.status === "sold" ? "#3C4C48" : "#6B3A10", fontWeight: 700 }}>
          {d.status === "sold" ? "الجهاز ده اتباع" : "الجهاز ده محجوز دلوقتي"}
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 16, borderBottom: "1px solid #E5EBE8" }}>
        <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>
          {fmt(d.price)} <span style={{ fontSize: 18, fontWeight: 600, color: "#4A5A56" }}>ج.م</span>
        </span>
        <span style={{ alignSelf: "flex-start", padding: "4px 12px", borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <svg {...ic(14)} strokeWidth={2.2}><path d="M5 12l4 4 10-10" /></svg>في نطاق السعر العادل للسوق
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, textAlign: "center", fontSize: 13, fontWeight: 600 }}>
        <div style={{ ...tile, background: "#E3F0ED", color: "#0B4A44" }}>
          <svg {...ic()}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>فلوسك محفوظة
        </div>
        <div style={{ ...tile, background: "#E6EDF7", color: "#1B3F73" }}>
          {inspected ? (
            <><svg {...ic()}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13l2 2 4-4" /></svg>تم الفحص</>
          ) : (
            <><svg {...ic()}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>فحص فني</>
          )}
        </div>
        <div style={{ ...tile, background: "#FBEEDC", color: "#6B3A10" }}>
          <svg {...ic()}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>لحد بابك
        </div>
      </div>

      {inspected ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", fontSize: 15, color: "#0B4A44" }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg {...ic(20)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          </span>
          <span style={{ fontWeight: 500 }}>فلوسك محفوظة عندنا {days} أيام من يوم ما تستلم الجهاز، والبايع مش بياخدها غير بعدها.</span>
        </div>
      ) : (
        <div style={{ padding: 16, borderRadius: 16, background: "#E6EDF7", border: "1px solid #C6D4EA", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 700, color: "#1B3F73" }}>لو الجهاز مطلعش مطابق في الفحص، فلوسك بترجعلك كاملة.</div>
          <div style={{ fontSize: 15, color: "#2D4566" }}>الفحص بيتم عند البايع خلال {days} أيام عمل من طلبك، وتقرير الفحص بيوصلك قبل الشحن.</div>
        </div>
      )}

      <div style={{ borderRadius: 16, border: "1px solid #DCE3DF", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", background: "#F5F7F4", fontWeight: 700 }}>الضمان على الجهاز ده</div>
        <div style={wRow}>
          <svg {...ic()} stroke="#0D5C55"><path d="M4 12a8 8 0 0 1 14-5.3L20 9" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" /><path d="M4 20v-5h5" /></svg>
          <span style={{ flex: 1 }}>استبدال أو استرجاع</span><span style={{ fontWeight: 600 }}>{days} أيام</span>
        </div>
        <div style={wRow}>
          <svg {...ic()} stroke="#0D5C55"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
          <span style={{ flex: 1 }}>ضمان تشغيل</span><span style={{ fontWeight: 600 }}>{days} أيام</span>
        </div>
        <div style={{ ...wRow, background: "#E3F0ED" }}>
          <svg {...ic()} stroke="#0D5C55"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></svg>
          <span style={{ flex: 1 }}>صيانة</span><span style={{ fontWeight: 700, color: "#0D5C55" }}>{d.maintenanceMonths} شهور</span>
        </div>
      </div>

      {inspected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, border: "1px solid #DCE3DF", fontSize: 15 }}>
          <svg {...ic()} stroke="#0D5C55" style={{ flex: "none" }}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
          <span style={{ flex: 1, fontWeight: 600 }}>مدة التوصيل المتوقعة</span>
          <span style={{ fontWeight: 700 }}>{BUSINESS.deliveryDaysInspected} أيام عمل</span>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 14, border: "1px solid #DCE3DF", fontSize: 15 }}>
          <svg {...ic()} stroke="#0D5C55" style={{ flex: "none", marginTop: 3 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>مدة التوصيل المتوقعة</span>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14, color: "#3C4C48" }}>
              <span>شاملة الفحص</span><span style={{ fontWeight: 700, color: "#12221F" }}>{BUSINESS.deliveryDaysWithInspection} أيام عمل</span>
            </span>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14, color: "#3C4C48" }}>
              <span>لو الجهاز تم فحصه</span><span style={{ fontWeight: 700, color: "#12221F" }}>{BUSINESS.deliveryDaysInspected} أيام عمل</span>
            </span>
          </span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {unavailable ? (
          <button type="button" disabled className="li-cta" style={{ minHeight: 56, border: 0, borderRadius: 14, color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 18 }}>
            {d.status === "sold" ? "الجهاز ده اتباع" : "الجهاز ده محجوز دلوقتي"}
          </button>
        ) : (
          // Phase 1 (PHASE1_PROMPT §9): ordering happens on WhatsApp; orders are Phase 2.
          <a href={waLink(orderMessage(d))} target="_blank" rel="noopener noreferrer" className="li-cta" style={{ minHeight: 56, borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {inspected ? "اطلب الجهاز" : "اطلب الجهاز وابدأ الفحص"}
            <svg {...ic(20)} strokeWidth={2}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
          </a>
        )}
        <div style={{ fontSize: 14, color: "#4A5A56", textAlign: "center" }}>
          تقدر تحجز الجهاز بـ {fmt(BUSINESS.buyerReservationDepositEGP)} ج.م بس، وبتتخصم من سعره. <Link href={routes.termsBuyer} style={{ fontWeight: 600 }}>شروط الشراء</Link>
        </div>
        <a href={waLink(askMessage(d))} target="_blank" rel="noopener noreferrer" className="li-ghost" style={{ minHeight: 48, borderRadius: 14, border: "1px solid #C9D4CF", color: "#12221F", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg {...ic(20)}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" /></svg>اسأل على واتساب
        </a>
      </div>
    </div>
  );
}
