"use client";

import Link from "next/link";
import { BUSINESS, sellerNetFromSalePrice } from "@/config/business";
import { isPublic } from "@/lib/demo/store";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import type { Device, Submission } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { artFor } from "../art";
import { INSP, SRC, ST, canToggle, toggleOf } from "./meta";

function noteOf(d: Device): [string, string, string, string, string, string] {
  if (d.status === "reserved")
    return ["#FBEEDC", "#6B3A10", `محجوز بعربون ${BUSINESS.buyerReservationDepositEGP} ج.م`, "مشتري حجز الجهاز ودفع العربون. الجهاز مش هيظهر لحد تاني لحد ما الطلب يكمل أو يتلغي.", routes.admin.orders, "افتح الطلب في «الطلبات والشحن»"];
  if (d.status === "sold")
    return ["#E6EDF7", "#1D3F72", "الطلب ماشي", `فلوس المشتري محفوظة، وبتتحول للبايع بعد الاستلام وفترة التجربة ${BUSINESS.trialDays} أيام.`, routes.admin.payments, "شوف الدفعة في «المدفوعات المحفوظة»"];
  if (d.inspection === "on_order")
    return ["#E6EDF7", "#1D3F72", "يُفحص عند الطلب", "أول ما مشتري يطلبه، فني معتمد بيفحصه وبيترفع تقرير الفحص قبل الشحن.", routes.admin.inspections, "افتح «الفحوصات»"];
  return ["#E3F0ED", "#0B4A44", "تم الفحص بفني معتمد", "تقرير الفحص مرفوع وظاهر للمشتري في صفحة الجهاز.", isPublic(d) ? routes.device(d.id) : routes.admin.inspections, "شوف تقرير الفحص"];
}

export function DevicePanel({
  d,
  sub,
  onClose,
  onToggle,
  onFeature,
}: {
  d: Device;
  sub?: Submission;
  onClose: () => void;
  onToggle: () => void;
  onFeature: () => void;
}) {
  const st = ST[d.status];
  const sr = SRC[d.source];
  const pin = INSP[d.inspection];
  const t = toggleOf(d);
  const note = noteOf(d);
  const net = d.sellerNet ?? sellerNetFromSalePrice(d.price);
  return (
    <>
      <div onClick={onClose} aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(238, 242, 240, 0.55)", borderRadius: 14 }} />
      <aside
        role="dialog"
        aria-label={`تفاصيل ${d.title}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 420,
          maxWidth: "100%",
          background: "#FFFFFF",
          border: "1px solid #DCE3DF",
          borderRadius: 20,
          boxShadow: "-4px 20px 50px rgba(18, 34, 31, 0.16)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#EEF4F1" }}>
          <svg role="img" aria-label={d.title} viewBox="0 0 120 90" style={{ display: "block", width: "100%", height: "100%" }}>
            <use href={artFor(d.type)} />
          </svg>
          <span className="al-pill" style={{ position: "absolute", top: 12, right: 12, background: pin.sbg, color: pin.sfg }}>
            {pin.l}
          </span>
          {d.featured ? (
            <span className="al-pill" style={{ position: "absolute", top: 12, left: 56, background: "#F2A33A", color: "#12221F" }}>
              ★ مميز
            </span>
          ) : null}
          <button
            type="button"
            className="al-act"
            onClick={onClose}
            aria-label="اقفل التفاصيل"
            autoFocus
            style={{ position: "absolute", top: 10, left: 10, width: 38, padding: 0, justifyContent: "center" }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#4A5A56" }}>
              {d.id} · {typeLabel(d.type)}
            </div>
            <h2 style={{ margin: 0, fontSize: 21, lineHeight: 1.4 }}>{d.title || "جهاز من غير اسم"}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              <span className="al-pill" style={{ background: st.bg, color: st.fg }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: st.fg }} />
                {st.l}
              </span>
              <span className="al-pill" style={{ background: sr.bg, color: sr.fg }}>
                {d.source === "seller" ? "بالنيابة عن بايع" : "ملك الشركة"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 14px", borderRadius: 14, background: "#F5F7F4" }}>
            <span style={{ color: "#4A5A56", fontSize: 14 }}>سعر البيع</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              {d.price ? fmt(d.price) : "—"} <span style={{ fontSize: 13, color: "#4A5A56", fontWeight: 400 }}>ج.م</span>
            </span>
          </div>
          <div>
            <div className="al-kv"><span>المحافظة</span><span>{d.governorate}</span></div>
            <div className="al-kv"><span>حالة المنتج</span><span>{CONDITIONS[d.condition].label}</span></div>
            <div className="al-kv"><span>الصيانة المجانية</span><span>{d.maintenanceMonths} شهور</span></div>
            <div className="al-kv"><span>اتضاف</span><span>{d.createdAt}</span></div>
            <div className="al-kv"><span>المشاهدات</span><span>{d.views ? fmt(d.views) : "—"}</span></div>
            {d.source === "seller" ? (
              <>
                <div className="al-kv">
                  <span>البايع</span>
                  <span>
                    {sub?.fullName ?? "[د. ...]"} · <span dir="ltr">{sub?.phone ?? "[01xxxxxxxxx]"}</span>
                  </span>
                </div>
                <div className="al-kv" style={{ background: "#FFF8EE", margin: "0 -8px", padding: "9px 8px", borderRadius: 8 }}>
                  <span>
                    صافي البايع (السعر × {1 - BUSINESS.platformFeeMaxRate})<span className="ad-int">داخلي</span>
                  </span>
                  <span style={{ fontWeight: 700 }}>{fmt(net)} ج.م</span>
                </div>
              </>
            ) : (
              <div className="al-kv"><span>الملكية</span><span>ملك الشركة</span></div>
            )}
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 14, background: note[0], color: note[1], fontSize: 14, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontWeight: 700 }}>{note[2]}</span>
            <span>{note[3]}</span>
            <Link href={note[4]} style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
              {note[5]}
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Link href={routes.admin.editDevice(d.id)} className="ad-btn ad-pri" style={{ color: "#FFFFFF", minHeight: 44, fontSize: 15, flex: "1 1 120px" }}>
              تعديل
            </Link>
            {canToggle(d) ? (
              <button type="button" className="ad-btn ad-sec" onClick={onToggle} style={{ minHeight: 44, fontSize: 15, flex: "1 1 120px" }}>
                {t.label === "نشر" ? "انشر الجهاز" : "اخفي الجهاز"}
              </button>
            ) : null}
            <button
              type="button"
              className="ad-btn ad-sec"
              onClick={onFeature}
              aria-pressed={d.featured}
              style={{ minHeight: 44, fontSize: 15, flex: "1 1 120px" }}
            >
              {d.featured ? "شيل التمييز" : "☆ ميّز الجهاز"}
            </button>
          </div>
          {isPublic(d) ? (
            <Link href={routes.device(d.id)} target="_blank" style={{ fontSize: 14, fontWeight: 600, textAlign: "center" }}>
              شوف صفحة الجهاز على الموقع ←
            </Link>
          ) : null}
        </div>
      </aside>
    </>
  );
}
