"use client";

import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt, parseNum } from "@/lib/demo/labels";
import type { Submission } from "@/lib/demo/types";
import { whenAr } from "@/lib/submissions/db";
import { useSettings } from "@/lib/settings";
import { waLink } from "@/lib/whatsapp";
import { FEE, FEE_METHODS } from "./meta";

const MIN_FEE = BUSINESS.sellerSeriousnessFeeEGP;

export type FeeHandlers = {
  /** Fee amount / transfer reference edited. */
  save: (patch: Pick<Submission, "feeAmount" | "feeReference">) => void;
  /** «اطلب الرسوم على واتساب» clicked. */
  requested: (amount: number) => void;
  /** «الرسوم وصلت»: record the payment and publish the listing. */
  paid: (amount: number, method: string, reference: string) => void;
  /** After it was paid: refunded to the seller / kept per the terms. */
  close: (status: "refunded" | "forfeited") => void;
};

/**
 * Seller seriousness fee (ADMIN_SPEC §2): set per device after accepting,
 * asked for on WhatsApp, and the listing goes live once it arrives.
 * Not in the design file — styled like its other inline panels.
 */
export function FeePanel({ p, h }: { p: Submission; h: FeeHandlers }) {
  const { transfer } = useSettings();
  const [amount, setAmount] = useState(String(p.feeAmount ?? MIN_FEE));
  const [ref, setRef] = useState(p.feeReference);
  const [method, setMethod] = useState(FEE_METHODS[0][0]);
  const [tried, setTried] = useState(false);
  const fee = FEE[p.feeStatus];
  const n = Math.round(parseNum(amount));
  const bad = !n || n < MIN_FEE;
  const pending = p.feeStatus === "pending";
  const changed = (n !== (p.feeAmount ?? 0) && !bad) || ref.trim() !== p.feeReference;

  const msg =
    `أهلاً ${p.fullName}، طلب بيع ${p.details} (${p.id}) اتقبل على «استعمال طبيب». ` +
    `رسوم الجدية للجهاز ده ${fmt(n || MIN_FEE)} ج.م، وتقدر تحوّلها InstaPay أو فودافون كاش على: ${transfer}. ` +
    `ابعتلنا رقم التحويل بعد ما تحوّل (أو اكتبه من صفحة حسابك)، والإعلان هيتنشر أول ما الرسوم توصل. الرسوم بترجعلك كاملة لما الجهاز يتباع.`;

  return (
    <div style={{ padding: 16, borderRadius: 16, background: "#F5F7F4", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontWeight: 700 }}>
          رسوم الجدية{p.feeAmount ? ` ${fmt(p.feeAmount)} ج.م` : ""}
          <span className="ad-int">داخلي</span>
        </span>
        <span className="sb-pill" style={{ background: fee.bg, color: fee.fg }}>
          {fee.txt}
        </span>
      </div>

      {pending ? (
        <>
          <div className="ad-grid">
            <label className="ad-field">
              المبلغ (ج.م) — {fmt(MIN_FEE)} على الأقل
              <input type="text" inputMode="numeric" className="ad-in" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={tried && bad} enterKeyHint="done" />
            </label>
            <label className="ad-field">
              اتحوّلت على
              <select className="ad-in" value={method} onChange={(e) => setMethod(e.target.value)}>
                {FEE_METHODS.map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              رقم التحويل
              <input type="text" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={ref} onChange={(e) => setRef(e.target.value)} placeholder="[IPN-xxxxxxxx]" autoComplete="off" enterKeyHint="done" />
            </label>
          </div>
          {tried && bad ? (
            <div role="alert" style={{ fontSize: 13, color: "#B3261E", fontWeight: 600 }}>
              الرسوم لازم تكون {fmt(MIN_FEE)} ج.م أو أكتر.
            </div>
          ) : null}
          <div className="ad-hint">
            {p.feeRequestedAt ? `اتطلبت من البايع ${whenAr(p.feeRequestedAt)}. ` : "لسه ماطلبناهاش من البايع. "}
            أول ما تأكد إن الرسوم وصلت، هتتسجل في المدفوعات و{p.deviceId ? `الإعلان ${p.deviceId}` : "الإعلان"} هيتنشر — كمّل بيانات الإعلان الأول.
          </div>
          <div className="sb-subacts">
            <a
              href={waLink(msg, p.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="sb-act sb-wa"
              onClick={(e) => {
                if (bad) {
                  e.preventDefault();
                  setTried(true);
                  return;
                }
                h.requested(n);
              }}
            >
              {p.feeRequestedAt ? "اطلبها تاني على واتساب ↗" : "اطلب الرسوم على واتساب ↗"}
            </a>
            <button
              type="button"
              className="sb-act sb-ok"
              onClick={() => {
                if (bad) {
                  setTried(true);
                  return;
                }
                h.paid(n, method, ref.trim());
              }}
            >
              الرسوم وصلت
            </button>
            {changed ? (
              <button type="button" className="sb-act" onClick={() => h.save({ feeAmount: bad ? p.feeAmount : n, feeReference: ref.trim() })}>
                احفظ
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          {p.feeReference ? (
            <div className="ad-hint">
              رقم التحويل: <span dir="ltr">{p.feeReference}</span>
            </div>
          ) : null}
          {p.feeStatus === "paid" ? (
            <div className="sb-subacts">
              <button type="button" className="sb-act" onClick={() => h.close("refunded")}>
                اترجعت للبايع (الجهاز اتباع)
              </button>
              <button type="button" className="sb-act sb-no" onClick={() => h.close("forfeited")}>
                اتخصمت حسب الشروط
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
