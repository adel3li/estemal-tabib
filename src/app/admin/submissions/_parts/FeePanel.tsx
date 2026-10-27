"use client";

import { useState } from "react";
import { BUSINESS } from "@/config/business";
import type { Submission } from "@/lib/demo/types";
import { FEE } from "./meta";

/**
 * Seriousness fee handling (PHASE1_PROMPT.md §9: «mark fee paid/refunded with reference»).
 * Not in the design file — styled like its other inline panels.
 */
export function FeePanel({ p, onSet }: { p: Submission; onSet: (status: Submission["feeStatus"], reference: string) => void }) {
  const [ref, setRef] = useState(p.feeReference);
  const fee = FEE[p.feeStatus];
  const fixed = p.feeStatus === "refunded" || p.feeStatus === "forfeited";
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "#F5F7F4", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontWeight: 700 }}>
          رسوم الجدية {BUSINESS.sellerSeriousnessFeeEGP} ج.م<span className="ad-int">داخلي</span>
        </span>
        <span className="sb-pill" style={{ background: fee.bg, color: fee.fg }}>
          {fee.txt}
        </span>
      </div>
      <label className="ad-field">
        رقم التحويل (InstaPay / تحويل بنكي)
        <input
          type="text"
          className="ad-in"
          dir="ltr"
          style={{ textAlign: "right" }}
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="[IPN-xxxxxxxx]"
          autoComplete="off"
          enterKeyHint="done"
        />
      </label>
      <div className="sb-subacts">
        {p.feeStatus !== "paid" && !fixed ? (
          <button type="button" className="sb-act sb-ok" onClick={() => onSet("paid", ref.trim())}>
            علّم إنها اتدفعت
          </button>
        ) : null}
        {p.feeStatus === "paid" ? (
          <>
            <button type="button" className="sb-act" onClick={() => onSet("refunded", ref.trim())}>
              علّم إنها اترجعت للبايع
            </button>
            <button type="button" className="sb-act sb-no" onClick={() => onSet("forfeited", ref.trim())}>
              اتخصمت حسب الشروط
            </button>
          </>
        ) : null}
        {p.feeReference !== ref.trim() && ref.trim() ? (
          <button type="button" className="sb-act" onClick={() => onSet(p.feeStatus, ref.trim())}>
            احفظ رقم التحويل
          </button>
        ) : null}
      </div>
    </div>
  );
}
