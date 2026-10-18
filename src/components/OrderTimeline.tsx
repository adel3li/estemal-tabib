import { ORDER_STEP_LABELS } from "@/lib/data";
import { formatDate } from "@/lib/site";
import type { Order, OrderStatus } from "@/lib/types";
import { Icon } from "./Icon";

/** Vertical order status timeline (CLAUDE.md §3). */
export function OrderTimeline({
  steps,
  current,
  timestamps,
  currentSlot,
}: {
  steps: OrderStatus[];
  current: OrderStatus;
  timestamps: Order["timestamps"];
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
        const info = ORDER_STEP_LABELS[step];
        return (
          <li key={step} className="relative flex gap-4" aria-current={isCurrent ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`z-10 flex size-9 flex-none items-center justify-center rounded-full border-2 text-sm font-bold ${
                  done
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                      ? "border-info bg-info-soft text-info"
                      : "border-line bg-surface text-subtle"
                }`}
              >
                {done ? <Icon name="check" size={18} strokeWidth={2.4} /> : (i + 1).toLocaleString("ar-EG")}
              </span>
              {!last && <span className={`w-0.5 flex-1 ${done ? "bg-primary" : "bg-line"}`} />}
            </div>
            <div className={`flex-1 pb-7 ${last ? "pb-0" : ""}`}>
              <div className={`font-bold ${!done && !isCurrent ? "text-muted" : ""}`}>
                {info.title}
                {isCurrent && <span className="ms-2 rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-semibold text-info">دلوقتي</span>}
              </div>
              <div className="text-[15px] text-muted">{info.detail}</div>
              {(done || isCurrent) && timestamps[step] && <div className="text-[13px] text-subtle">{formatDate(timestamps[step])}</div>}
              {isCurrent && currentSlot && <div className="mt-3">{currentSlot}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
