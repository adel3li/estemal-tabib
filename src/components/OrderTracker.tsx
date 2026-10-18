"use client";

import { useState } from "react";
import { ORDER_STEP_LABELS } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/types";
import { Icon } from "./Icon";
import { OrderTimeline } from "./OrderTimeline";
import { btn } from "./ui";

/**
 * Timeline plus the buyer's decision at the report step. Demo only: the
 * decision lives in local state until there is an orders API.
 */
export function OrderTracker({ order, steps }: { order: Order; steps: OrderStatus[] }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const now = new Date().toISOString();

  if (status === "cancelled_refunded") {
    const info = ORDER_STEP_LABELS.cancelled_refunded;
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-5" role="status">
        <Icon name="check" size={24} strokeWidth={2.2} className="mt-0.5 flex-none text-primary" />
        <div>
          <div className="text-lg font-bold">{info.title}</div>
          <div className="text-muted">{info.detail} [المدة] على نفس وسيلة الدفع.</div>
        </div>
      </div>
    );
  }

  const actions =
    status === "report_sent_awaiting_buyer" ? (
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-ground p-4">
        <div className="font-semibold">راجع تقرير الفحص، وبعدين قرّر:</div>
        {confirmingCancel ? (
          <div className="flex flex-col gap-2.5">
            <div className="font-semibold">متأكد إنك عايز تلغي؟ فلوسك هترجعلك كاملة.</div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => setStatus("cancelled_refunded")} className={`${btn.outline} cursor-pointer border-warn text-warn`}>
                أيوه، الغي واسترد فلوسي
              </button>
              <button type="button" onClick={() => setConfirmingCancel(false)} className={`${btn.outline} cursor-pointer`}>
                رجوع
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setStatus("shipping")} className={`${btn.primary} cursor-pointer`}>
              الجهاز مطابق — اشحنه
            </button>
            <button type="button" onClick={() => setConfirmingCancel(true)} className={`${btn.outline} cursor-pointer`}>
              الغي واسترد فلوسي
            </button>
          </div>
        )}
      </div>
    ) : null;

  return (
    <OrderTimeline
      steps={steps}
      current={status}
      timestamps={status === order.status ? order.timestamps : { ...order.timestamps, [status]: now }}
      currentSlot={actions}
    />
  );
}
