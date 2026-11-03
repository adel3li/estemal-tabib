"use client";

import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt, parseNum } from "@/lib/demo/labels";
import { LOCATIONS, PAY_METHODS, STEP_TRIAL, type Order, type PayMethod } from "@/lib/orders/orders";

type Props = {
  o: Order;
  /** false = marketing team: only «where the device is». */
  money: boolean;
  busy: boolean;
  onPay: (amount: number, method: PayMethod, reference: string) => void;
  onLocation: (loc: string) => void;
  onCancel: (refund: number) => void;
  onReturn: (refund: number, ourFault: boolean) => void;
};

/**
 * Payments in, where the device is, cancel / return (ADMIN_SPEC §5, §9).
 * Not in the design files — styled like the other order panels.
 */
export function MoneyActions({ o, money, busy, onPay, onLocation, onCancel, onReturn }: Props) {
  const [amount, setAmount] = useState(String(o.remaining || ""));
  const [method, setMethod] = useState<PayMethod>(o.payMethod ?? "instapay");
  const [ref, setRef] = useState("");
  const [mode, setMode] = useState<"" | "cancel" | "return">("");
  const [ourFault, setOurFault] = useState(true);
  const dep = Math.min(BUSINESS.buyerReservationDepositEGP, o.collected);
  const defRefund = mode === "return" && !ourFault ? Math.max(0, o.collected - dep) : o.collected;
  const [refund, setRefund] = useState("");
  const refundNum = refund === "" ? defRefund : Math.round(parseNum(refund));
  const active = o.status === "active";
  const inWarranty = active && o.step === STEP_TRIAL;
  const n = Math.round(parseNum(amount));

  return (
    <div className="or-box" style={{ padding: 18, borderRadius: 18, border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{money ? "الفلوس ومكان الجهاز" : "مكان الجهاز"}</h3>
      <label className="ad-field" style={{ maxWidth: 320 }}>
        الجهاز فين دلوقتي؟
        <select className="ad-in" value={o.location} onChange={(e) => onLocation(e.target.value)} disabled={!active || busy}>
          <option value="">—</option>
          {LOCATIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>

      {money && active && o.remaining > 0 ? (
        <>
          <div style={{ fontWeight: 600 }}>سجّل دفعة من المشتري · الباقي {fmt(o.remaining)} ج.م</div>
          <div className="ad-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            <label className="ad-field">
              المبلغ (ج.م)
              <input type="text" inputMode="numeric" className="ad-in" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label className="ad-field">
              الطريقة
              <select className="ad-in" value={method} onChange={(e) => setMethod(e.target.value as PayMethod)}>
                {PAY_METHODS.map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              رقم التحويل
              <input type="text" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={ref} onChange={(e) => setRef(e.target.value)} />
            </label>
          </div>
          <div className="or-acts">
            <button type="button" className="ad-btn ad-sec" disabled={busy || !n || n > o.remaining} onClick={() => onPay(n, method, ref.trim())}>
              سجّل الدفعة
            </button>
            {n > o.remaining ? <span className="ad-hint" style={{ color: "#B3261E" }}>أكبر من الباقي.</span> : null}
          </div>
        </>
      ) : null}

      {money && active && !mode ? (
        <div className="or-acts">
          {o.step < STEP_TRIAL ? (
            <button type="button" className="ad-btn ad-sec" style={{ color: "#B3261E" }} onClick={() => setMode("cancel")}>
              إلغاء الطلب
            </button>
          ) : null}
          {inWarranty ? (
            <button type="button" className="ad-btn ad-sec" style={{ color: "#B3261E" }} onClick={() => setMode("return")}>
              المشتري رجّع الجهاز
            </button>
          ) : null}
        </div>
      ) : null}

      {mode ? (
        <div style={{ padding: 14, borderRadius: 14, background: "#FBE9E7", border: "1px solid #E9B3AE", display: "flex", flexDirection: "column", gap: 10, color: "#7A1A14" }}>
          <b>{mode === "cancel" ? "إلغاء الطلب" : `مرتجع خلال الـ${BUSINESS.trialDays} أيام`}</b>
          {mode === "return" ? (
            <div role="radiogroup" aria-label="سبب الإرجاع" style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" name="or-ret" checked={ourFault} onChange={() => { setOurFault(true); setRefund(""); }} />
                عيب أو خطأ من جهتنا — المبلغ كله بيرجع
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" name="or-ret" checked={!ourFault} onChange={() => { setOurFault(false); setRefund(""); }} />
                أسباب شخصية — المشتري يتحمل شحن الإرجاع وعربون الحجز مبيرجعش
              </label>
            </div>
          ) : null}
          <label className="ad-field" style={{ maxWidth: 260 }}>
            المبلغ اللي هيرجع للمشتري (ج.م)
            <input type="text" inputMode="numeric" className="ad-in" value={refund === "" ? String(defRefund) : refund} onChange={(e) => setRefund(e.target.value)} />
          </label>
          <div style={{ fontSize: 13 }}>
            {mode === "return" ? "الإعلان هيرجع «متاح» على الموقع (نفس الإعلان)." : "الجهاز هيرجع «متاح» على الموقع."} اتدفع {fmt(o.collected)} ج.م.
          </div>
          <div className="or-acts">
            <button
              type="button"
              className="ad-btn ad-pri"
              style={{ background: "#B3261E", borderColor: "#B3261E" }}
              disabled={busy || refundNum > o.collected}
              onClick={() => (mode === "cancel" ? onCancel(refundNum) : onReturn(refundNum, ourFault))}
            >
              أكّد
            </button>
            <button type="button" className="ad-btn ad-sec" onClick={() => { setMode(""); setRefund(""); }}>
              رجوع
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
