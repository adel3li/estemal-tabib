"use client";

import { BUSINESS } from "@/config/business";
import type { Submission } from "@/lib/demo/types";
import { whenAr } from "@/lib/submissions/db";
import { noReplyDeadline } from "@/lib/submissions/time";

const DAYS = BUSINESS.noReplyBusinessDays;

/**
 * Contact with the seller and the no-reply rule (ADMIN_SPEC §2): it counts
 * from OUR FIRST message, so a late reply to a later message doesn't reset it.
 */
export function ContactPanel({
  p,
  now,
  onReplied,
  onCancel,
}: {
  p: Submission;
  now: number;
  onReplied: () => void;
  onCancel: () => void;
}) {
  if (!p.firstContactAt) {
    return (
      <div className="ad-hint" style={{ padding: "10px 14px", borderRadius: 12, background: "#F5F7F4" }}>
        لسه ماتواصلناش مع البايع. أول رسالة على واتساب (من «كلّمه على واتساب» أو «اطلب الرسوم») بتبدأ مهلة الـ{DAYS} أيام عمل.
      </div>
    );
  }
  const deadline = noReplyDeadline(p.firstContactAt);
  const late = !p.sellerRepliedAt && now > deadline;
  return (
    <div
      role={late ? "alert" : undefined}
      style={{
        padding: "12px 16px",
        borderRadius: 14,
        background: late ? "#FBE9E7" : "#F5F7F4",
        border: `1px solid ${late ? "#E9B3AE" : "#DCE3DF"}`,
        color: late ? "#7A1A14" : "#3C4C48",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        fontSize: 14,
      }}
    >
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span>أول رسالة لينا للبايع: {whenAr(p.firstContactAt)}</span>
        {p.sellerRepliedAt ? (
          <b style={{ color: "#3F7A1F" }}>البايع رد ✓ ({whenAr(p.sellerRepliedAt)})</b>
        ) : late ? (
          <b>عدّى {DAYS} أيام عمل من أول رسالة ومفيش رد. حسب الشروط تقدر تلغي العرض والرسوم متترجعش.</b>
        ) : (
          <span>مستنيين رد البايع — المهلة لحد {whenAr(new Date(deadline).toISOString())}.</span>
        )}
      </span>
      {!p.sellerRepliedAt ? (
        <span className="sb-subacts">
          <button type="button" className="sb-act" onClick={onReplied}>
            البايع رد
          </button>
          {late ? (
            <button type="button" className="sb-act sb-danger" onClick={onCancel}>
              إلغاء العرض — مفيش رد
            </button>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
