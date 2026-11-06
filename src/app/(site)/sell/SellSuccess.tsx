"use client";

import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { routes } from "@/lib/routes";

// docs/ADMIN_SPEC.md §2: review in 24 h → fee set and requested after
// acceptance → published once it arrives. Nothing to pay at this point.
const stepsFor = (atUs: boolean) =>
  atUs
    ? [
        "هنراجع طلبك خلال 24 ساعة ونتأكد إن السعر مناسب للسوق.",
        `لو اتقبل، هنتفق معاك على واتساب على ميعاد شحن الجهاز لمقرنا (الشحن على حسابك). مفيش رسوم جدية، بشرط الجهاز يفضل عندنا ${BUSINESS.minListingDays} أيام على الأقل.`,
        "بنفحص الجهاز وبننشر إعلانه بعلامة «تم الفحص».",
      ]
    : [
        "هنراجع طلبك خلال 24 ساعة ونتأكد إن السعر مناسب للسوق.",
        `لو اتقبل، هنبلغك على واتساب بقيمة رسوم الجدية (بتبدأ من ${BUSINESS.sellerSeriousnessFeeEGP} ج.م حسب قيمة الجهاز)، وتقدر تدفعها وتسجّل رقم التحويل من حسابك.`,
        "أول ما الرسوم توصل، إعلانك بيتنشر على المنصة.",
      ];
/** The usual case (device stays with the seller); also shown in the sell page's side panel. */
export const NEXT_STEPS = stepsFor(false);

export function SellSuccess({ id, onAgain, missingPhotos = 0, atUs = false }: { id: string; onAgain: () => void; missingPhotos?: number; atUs?: boolean }) {
  const steps = stepsFor(atUs);
  return (
    <section className="sl-done">
      <div className="sl-done-card" style={{ borderRadius: 12, background: "#FFFFFF", border: "1px solid #CCD8DC", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        <span style={{ width: 96, height: 96, borderRadius: 999, background: "#E2F4F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 68, height: 68, borderRadius: 999, background: "#0A7E99", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </span>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>استلمنا بيانات جهازك</h1>
        <span style={{ padding: "4px 16px", borderRadius: 999, background: "#F3F6F7", border: "1px solid #CCD8DC", fontWeight: 700, fontSize: 15 }}>
          رقم الطلب: <span dir="ltr" data-testid="sell-id">{id}</span>
        </span>
        <p style={{ margin: 0, color: "#4A595A", fontSize: 17 }}>مش مطلوب منك تدفع حاجة دلوقتي.</p>
        {missingPhotos ? (
          <p role="status" style={{ margin: 0, padding: "10px 14px", borderRadius: 12, background: "#FFF5EA", border: "1px solid #F8C788", color: "#6B3A10", fontSize: 15, fontWeight: 600 }}>
            {missingPhotos === 1 ? "صورة واحدة ما اترفعتش" : `${missingPhotos} صور ما اترفعتش`} — مش مشكلة، فريقنا هيكلمك ياخدها منك.
          </p>
        ) : null}

        <ol style={{ margin: "6px 0 0", padding: 0, listStyle: "none", width: "100%", display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
          {steps.map((s, i) => (
            <li key={s} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: "#E2F4F8", color: "#0A7E99", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{"١٢٣"[i]}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="sl-done-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingTop: 6 }}>
          <Link href={routes.home} className="sl-teal" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, background: "#0A7E99", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>
            ارجع للرئيسية
          </Link>
          <Link href={routes.accountTab("devices")} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4D3", background: "#FFFFFF", color: "#122022", fontWeight: 600, display: "flex", alignItems: "center" }}>
            تابع طلبك من حسابك
          </Link>
          <Link href={routes.devices} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4D3", background: "#FFFFFF", color: "#122022", fontWeight: 600, display: "flex", alignItems: "center" }}>
            شوف كل الأجهزة
          </Link>
          <button type="button" onClick={onAgain} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4D3", background: "#FFFFFF", font: "inherit", fontWeight: 600, cursor: "pointer" }}>
            اعرض جهاز تاني
          </button>
        </div>
      </div>
    </section>
  );
}
