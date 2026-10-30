"use client";

import Link from "next/link";
import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";

const NEXT_STEPS = [
  "حوّل رسوم الجدية وسجّل رقم التحويل هنا.",
  "هنكلمك على واتساب خلال 24 ساعة نراجع البيانات ونحدد ميعاد الفحص.",
  "الفني المعتمد يفحص الجهاز، وبعدها نعرضه على المنصة.",
];

/** `dbId`: the seller_submissions row (the transfer reference is saved there too). */
export function SellSuccess({ id, dbId, onAgain }: { id: string; dbId?: string; onAgain: () => void }) {
  const { state, updateSubmission } = useDemo();
  const sub = state.submissions.find((s) => s.id === id);
  const [ref, setRef] = useState("");
  const [msg, setMsg] = useState("");
  const saved = sub?.feeReference ?? "";

  const saveRef = async () => {
    const v = ref.trim();
    if (v.length < 4) {
      setMsg("اكتب رقم التحويل زي ما ظاهر في رسالة البنك أو إنستاباي");
      return;
    }
    if (dbId) {
      const { error } = await supabaseBrowser().from("seller_submissions").update({ fee_reference: v }).eq("id", dbId);
      if (error) {
        setMsg("ما قدرناش نسجّل الرقم دلوقتي. جرّب تاني بعد شوية.");
        return;
      }
    }
    updateSubmission(id, { feeReference: v }, { text: `البايع سجّل رقم التحويل: ${v}`, tone: "info" });
    setMsg("");
    setRef("");
  };

  return (
    <section className="sl-done">
      <div className="sl-done-card" style={{ borderRadius: 28, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        <span style={{ width: 96, height: 96, borderRadius: 999, background: "#E3F0ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 68, height: 68, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </span>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>استلمنا بيانات جهازك</h1>
        <span style={{ padding: "4px 16px", borderRadius: 999, background: "#F5F7F4", border: "1px solid #DCE3DF", fontWeight: 700, fontSize: 15 }}>
          رقم الطلب: <span dir="ltr" data-testid="sell-id">{id}</span>
        </span>
        <p style={{ margin: 0, color: "#4A5A56", fontSize: 17 }}>هنكلمك على واتساب خلال 24 ساعة نحدد ميعاد الفحص. الجهاز هيفضل معروض 7 أيام على الأقل.</p>

        <ol style={{ margin: "6px 0 0", padding: 0, listStyle: "none", width: "100%", display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
          {NEXT_STEPS.map((s, i) => (
            <li key={s} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: "#E3F0ED", color: "#0D5C55", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{"١٢٣"[i]}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="sl-box" style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: 20, borderRadius: 18, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10", display: "flex", flexDirection: "column", gap: 10, textAlign: "right" }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#12221F" }}>ادفع رسوم الجدية: {BUSINESS.sellerSeriousnessFeeEGP} ج.م بحد أدنى</span>
          <span style={{ fontSize: 15 }}>
            حوّل المبلغ بإنستاباي أو تحويل بنكي على: <b style={{ color: "#12221F" }}>{BUSINESS.feeTransferDetails}</b>
          </span>
          <span style={{ fontSize: 14 }}>اكتب رقم الطلب ({id}) في ملاحظة التحويل لو ينفع. الرسوم بترجعلك حسب شروط البيع.</span>
          {saved ? (
            <span role="status" style={{ padding: "10px 14px", borderRadius: 12, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0B4A44", fontWeight: 600, fontSize: 15 }}>
              ✓ سجّلنا رقم التحويل <span dir="ltr">{saved}</span>. هنأكد الدفع ونبلغك على واتساب.
            </span>
          ) : null}
          <label className="sl-field" style={{ color: "#6B3A10" }}>
            {saved ? "غلطت في الرقم؟ اكتبه تاني" : "رقم التحويل (Reference)"}
            <input type="text" dir="ltr" style={{ textAlign: "right" }} className={msg ? "sl-in sl-bad" : "sl-in"} placeholder="مثال: 123456789" autoComplete="off" enterKeyHint="done" value={ref} onChange={(e) => setRef(e.target.value)} />
          </label>
          {msg ? (
            <span className="sl-msg" role="alert">
              {msg}
            </span>
          ) : null}
          <button type="button" onClick={() => void saveRef()} className="sl-teal sl-ref-btn" style={{ alignSelf: "flex-start", minHeight: 46, display: "flex", alignItems: "center", padding: "0 20px", borderRadius: 12, border: 0, background: "#0D5C55", color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>
            سجّل رقم التحويل
          </button>
        </div>

        <div className="sl-done-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingTop: 6 }}>
          <Link href={routes.home} className="sl-teal" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>
            ارجع للرئيسية
          </Link>
          <Link href={routes.accountTab("devices")} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", color: "#12221F", fontWeight: 600, display: "flex", alignItems: "center" }}>
            تابع طلبك من حسابك
          </Link>
          <Link href={routes.devices} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", color: "#12221F", fontWeight: 600, display: "flex", alignItems: "center" }}>
            شوف كل الأجهزة
          </Link>
          <button type="button" onClick={onAgain} className="sl-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", fontWeight: 600, cursor: "pointer" }}>
            اعرض جهاز تاني
          </button>
        </div>
      </div>
    </section>
  );
}
