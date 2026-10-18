"use client";

import { useState } from "react";
import { ORDER_STATUS_PILL, ORDER_STEP_LABELS } from "@/lib/data";
import type { InspectionReport, MaintenanceMonths, Order, OrderStatus } from "@/lib/types";
import { Icon } from "./Icon";
import { OrderTimeline } from "./OrderTimeline";
import { btn } from "./ui";

function notesSummary(n: number) {
  if (n === 0) return "الجهاز مطابق للإعلان.";
  if (n === 1) return "الجهاز مطابق للإعلان مع ملاحظة واحدة مُعلنة.";
  if (n === 2) return "الجهاز مطابق للإعلان مع ملاحظتين مُعلنتين.";
  return `الجهاز مطابق للإعلان مع ${n.toLocaleString("ar-EG")} ملاحظات مُعلنة.`;
}

function notesChip(n: number) {
  if (n === 1) return "ملاحظة واحدة";
  if (n === 2) return "ملاحظتين";
  return `${n.toLocaleString("ar-EG")} ملاحظات`;
}

/**
 * Order header, timeline and the buyer's decision at the report step, plus
 * whatever the page passes as `aside` and `children` (the report). Demo only:
 * the decision lives in local state until there is an orders API.
 */
export function OrderTracker({
  order,
  listingTitle,
  steps,
  report,
  maintenanceMonths,
  aside,
  children,
}: {
  order: Order;
  listingTitle: string;
  steps: OrderStatus[];
  report?: InspectionReport;
  maintenanceMonths: MaintenanceMonths;
  aside: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [timestamps, setTimestamps] = useState(order.timestamps);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const cancelled = status === "cancelled_refunded";

  function advance(next: OrderStatus) {
    setStatus(next);
    setTimestamps((t) => ({ ...t, [next]: new Date().toISOString() }));
  }

  const notes = report?.disclosedDefects.length ?? 0;
  const details: Partial<Record<OrderStatus, string>> = {
    inspection_at_seller: report
      ? `فحص بواسطة فني ${report.technicianName ?? "[الاسم]"} ومراجعة د. ${report.reviewingDentistName ?? "[اسم الطبيب]"}`
      : undefined,
    report_sent_awaiting_buyer: report ? `${notesSummary(notes)} راجع التقرير وأكّد علشان نشحن.` : undefined,
    released_to_seller: `${ORDER_STEP_LABELS.released_to_seller.detail}، وتبدأ الصيانة ${maintenanceMonths} شهور`,
  };

  const decision =
    status === "report_sent_awaiting_buyer" && report ? (
      <>
        <div className="mt-3.5 flex flex-wrap items-center gap-3 rounded-2xl bg-ground p-4">
          <div className="flex min-w-0 flex-[1_1_220px] flex-wrap gap-2">
            <span className="rounded-full bg-primary-soft px-3 py-0.5 text-sm font-semibold text-primary">
              كفاءة التشغيل: {report.operationScore}
            </span>
            {report.highlights?.map((h) => (
              <span key={h.label} className="rounded-full bg-primary-soft px-3 py-0.5 text-sm font-semibold text-primary">
                <bdi>{h.label}</bdi>: {h.value}
              </span>
            ))}
            {notes > 0 && (
              <span className="rounded-full bg-warn-soft px-3 py-0.5 text-sm font-semibold text-warn">{notesChip(notes)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href="#report" className={`${btn.outline} min-h-[46px]`}>
              شوف التقرير
            </a>
            <button type="button" onClick={() => advance("shipping")} className={`${btn.primary} min-h-[46px] cursor-pointer px-5 font-bold`}>
              أكّد وابدأ الشحن
            </button>
          </div>
        </div>
        {confirmingCancel ? (
          <div className="mt-2.5 flex flex-col gap-2.5 rounded-2xl border border-warn-soft bg-warn-tint p-4" role="alertdialog" aria-label="تأكيد الإلغاء">
            <div className="font-semibold">متأكد إنك عايز تلغي؟ فلوسك هترجعلك كاملة.</div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => advance("cancelled_refunded")} className={`${btn.outline} cursor-pointer border-warn text-warn`}>
                أيوه، الغي واسترد فلوسي
              </button>
              <button type="button" onClick={() => setConfirmingCancel(false)} className={`${btn.outline} cursor-pointer`}>
                رجوع
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2.5 text-sm text-muted">
            مش موافق على التقرير؟{" "}
            <button type="button" onClick={() => setConfirmingCancel(true)} className="min-h-11 cursor-pointer font-semibold text-primary hover:text-primary-hover">
              إلغي الطلب واسترد فلوسك كاملة
            </button>
          </div>
        )}
      </>
    ) : null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-[28px] sm:text-[32px]">متابعة طلبك</h1>
          <div className="text-muted">
            طلب رقم {order.id} · {listingTitle}
          </div>
        </div>
        <span
          role="status"
          className={`rounded-full px-4 py-2 font-semibold ${
            status === "report_sent_awaiting_buyer" ? "bg-warn-soft text-warn" : "bg-primary-soft text-primary"
          }`}
        >
          {ORDER_STATUS_PILL[status]}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-7">
        <section aria-label="حالة الطلب" className="min-w-0 flex-[999_1_560px] rounded-3xl border border-line bg-surface p-5 sm:p-[30px]">
          {cancelled ? (
            <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-5">
              <Icon name="check" size={24} strokeWidth={2.2} className="mt-0.5 flex-none text-primary" />
              <div>
                <div className="text-lg font-bold">{ORDER_STEP_LABELS.cancelled_refunded.title}</div>
                <div className="text-muted">{ORDER_STEP_LABELS.cancelled_refunded.detail} [المدة] على نفس وسيلة الدفع.</div>
              </div>
            </div>
          ) : (
            <OrderTimeline steps={steps} current={status} timestamps={timestamps} details={details} currentSlot={decision} />
          )}
        </section>
        <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">{aside}</aside>
      </div>

      {!cancelled && children}
    </>
  );
}
