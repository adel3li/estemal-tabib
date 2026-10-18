import { ORDER_STEP_LABELS } from "@/lib/data";
import { formatDate } from "@/lib/site";
import type { Order, OrderStatus } from "@/lib/types";
import { Icon } from "./Icon";

/** Vertical order status timeline (CLAUDE.md §3). */
export function OrderTimeline({
  steps,
  current,
  timestamps,
  details = {},
  currentSlot,
}: {
  steps: OrderStatus[];
  current: OrderStatus;
  timestamps: Order["timestamps"];
  /** Per-step detail text that replaces the default copy. */
  details?: Partial<Record<OrderStatus, string>>;
  /** Extra content rendered under the current step (e.g. action buttons). */
  currentSlot?: React.ReactNode;
}) {
  const currentIndex = steps.indexOf(current);
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const isCurrent = i === currentIndex;
        const last = i === steps.length - 1;
        const title = ORDER_STEP_LABELS[step].title;
        const detail = details[step] ?? ORDER_STEP_LABELS[step].detail;
        const date = done || isCurrent ? timestamps[step] : undefined;
        return (
          <li key={step} className="flex gap-[18px]" aria-current={isCurrent ? "step" : undefined}>
            <div className="flex flex-none flex-col items-center">
              {done ? (
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
                  <Icon name="check" size={18} strokeWidth={2.6} />
                </span>
              ) : isCurrent ? (
                <span className="flex size-9 items-center justify-center rounded-full border-[3px] border-accent bg-surface">
                  <span className="size-3 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="size-9 rounded-full border-2 border-field bg-surface" />
              )}
              {!last && <span className={`min-h-7 w-[3px] flex-1 ${done ? "bg-primary" : "bg-line"}`} />}
            </div>
            <div className={`min-w-0 flex-1 ${last ? "" : isCurrent ? "pb-[26px]" : "pb-[22px]"} ${done || isCurrent ? "" : "text-muted"}`}>
              <div className="text-lg font-bold text-ink">
                <span className="sr-only">{done ? "خلصت: " : isCurrent ? "الخطوة الحالية: " : "لسه: "}</span>
                {title}
              </div>
              <div className="text-[15px] text-muted">
                {detail}
                {date && ` · ${formatDate(date)}`}
              </div>
              {isCurrent && currentSlot}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
