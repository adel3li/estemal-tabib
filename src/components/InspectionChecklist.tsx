import type { ChecklistItem } from "@/lib/types";
import { Icon } from "./Icon";

const RESULT = {
  pass: { label: "سليم", row: "", dot: "bg-primary text-white", text: "text-primary" },
  note: { label: "ملاحظة", row: "bg-warn-tint", dot: "bg-accent text-ink", text: "text-warn" },
  fail: { label: "عطل", row: "bg-warn-soft", dot: "bg-warn text-white", text: "text-warn" },
};

/** Results of a completed inspection. */
export function InspectionChecklist({ title, items }: { title: string; items: ChecklistItem[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line-soft">
      <div className="bg-ground px-[18px] py-3 font-bold">{title}</div>
      <ul>
        {items.map((item) => {
          const r = RESULT[item.result];
          return (
            <li key={item.label} className={`flex items-center gap-3 border-t border-line-soft px-[18px] py-[13px] ${r.row}`}>
              <span className={`flex size-[26px] flex-none items-center justify-center rounded-full font-bold ${r.dot}`}>
                {item.result === "pass" ? <Icon name="check" size={15} strokeWidth={2.6} /> : "!"}
              </span>
              <span className="flex-1">
                {item.label}
                {item.note && ` — ${item.note}`}
              </span>
              <span className={`text-sm font-semibold ${r.text}`}>{r.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** What will be checked, for listings inspected on order. */
export function PlannedChecklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((label) => (
        <li key={label} className="flex items-center gap-3 rounded-[14px] border border-dashed border-[#9FB2C9] px-4 py-3.5">
          <span className="size-6 flex-none rounded-full border-2 border-info" />
          {label}
        </li>
      ))}
    </ul>
  );
}
