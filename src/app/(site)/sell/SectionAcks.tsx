"use client";

import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { routes } from "@/lib/routes";
import { ACKS, fieldId } from "./form";
import { CardHead, Msg, radioStyle, type SectionProps } from "./ui";

export const ackCount = (f: SectionProps["f"]) => ACKS.filter((a) => f.acks[a.key]).length;

export function SectionAcks({ f, set, err }: SectionProps) {
  const n = ackCount(f);
  return (
    <fieldset id="sl-s6" className="sl-card">
      <CardHead
        iconBg="#E6EDF7"
        iconFg="#24508F"
        step="الخطوة ٦ من ٦"
        stepFg="#24508F"
        title="٦. الإقرارات"
        icon={
          <>
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </>
        }
        extra={
          <span aria-live="polite" style={{ padding: "4px 12px", borderRadius: 999, background: "#F5F7F4", fontSize: 14, fontWeight: 700, color: "#3C4C48" }} dir="ltr">
            {n} / {ACKS.length}
          </span>
        }
      />
      <div className="sl-body" style={{ gap: 12 }}>
        {ACKS.map((a, i) => (
          <label key={a.key} className={err.acks && !f.acks[a.key] ? "sl-ack sl-bad-box" : "sl-ack"}>
            <input
              type="checkbox"
              id={i === 0 ? fieldId("acks") : undefined}
              checked={f.acks[a.key]}
              onChange={(e) => set({ acks: { ...f.acks, [a.key]: e.target.checked } })}
              style={radioStyle(22, "2px 0 0")}
              required
            />
            <span>{a.label}</span>
          </label>
        ))}
        <Msg k="acks" err={err} />
        <Link href={routes.terms} className="sl-terms" style={{ fontWeight: 600, alignSelf: "flex-start" }}>
          اقرأ شروط البيع كاملة ←
        </Link>
      </div>
    </fieldset>
  );
}

/** «رسوم جدية العرض» box + progress + submit button. */
export function FeeBox({ f, onSubmit }: { f: SectionProps["f"]; onSubmit: () => void }) {
  const n = ackCount(f);
  const ready = n === ACKS.length;
  const fee = BUSINESS.sellerSeriousnessFeeEGP;
  return (
    <aside style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="sl-fee" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #E5EBE8" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 48, height: 48, borderRadius: 15, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h3" />
              </svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: 20 }}>رسوم جدية العرض</span>
          </span>
          <span className="sl-fee-amt">{fee} ج.م <span style={{ fontSize: 14, fontWeight: 600 }}>بحد أدنى</span></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
          <div style={{ padding: "16px 18px", borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "#0B4A44" }}>
            <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              بترجعلك كاملة لو:
            </span>
            <span>• الجهاز اتباع عن طريق المنصة</span>
            <span>• طلبت إلغاء العرض بعد 7 أيام على الأقل من غير ما حد يطلب يشتريه</span>
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 16, background: "#FBEEDC", border: "1px solid #F0C88A", display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "#6B3A10" }}>
            <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
              مش بترجع لو:
            </span>
            <span>• ما سلّمتش الجهاز للفحص أو الشحن خلال 3 أيام عمل من طلب الشراء</span>
            <span>• الفحص أثبت إن الجهاز مش مطابق للوصف أو العيوب المذكورة</span>
            <span>• رجعت في البيع بعد ما المشتري دفع</span>
          </div>
        </div>
        <div style={{ fontSize: 14, color: "#4A5A56", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          ثمن الجهاز بيتحولك بعد {BUSINESS.trialDays} أيام من استلام المشتري، لو مفيش طلب استرجاع مقبول.
        </div>
        <div className="sl-box" style={{ padding: 18, borderRadius: 18, background: "#F5F7F4", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 20px" }}>
          <div style={{ flex: "1 1 240px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14, fontWeight: 600, color: "#3C4C48" }}>
              <span>الإقرارات</span>
              <span dir="ltr">
                {n} / {ACKS.length}
              </span>
            </span>
            <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: "#DCE3DF", overflow: "hidden", display: "block" }}>
              <span style={{ display: "block", height: "100%", width: `${Math.round((n / ACKS.length) * 100)}%`, background: "#0D5C55", borderRadius: 999, transition: "width .2s ease" }} />
            </span>
            <span style={{ fontSize: 13, color: "#4A5A56" }}>{ready ? "هنراجع البيانات ونبعتلك خطوات دفع الرسوم" : "وافق على الإقرارات الثلاثة علشان تكمل"}</span>
          </div>
          {/* aria-disabled instead of disabled: clicking it still scrolls to the missing declarations. */}
          <button
            type="button"
            className="sl-submit"
            onClick={onSubmit}
            aria-disabled={!ready}
            style={{ flex: "1 1 280px", minHeight: 58, padding: "0 22px", borderRadius: 16, border: 0, background: ready ? "#0D5C55" : "#C9D4CF", color: ready ? "#FFFFFF" : "#3C4C48", font: "inherit", fontWeight: 700, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            ابعت الطلب
          </button>
        </div>
      </div>
    </aside>
  );
}
