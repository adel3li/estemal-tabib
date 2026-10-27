import type { ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import type { DeviceType } from "@/lib/demo/types";
import type { Filters } from "./filters";

type Chip<T extends string> = { id: T; label: string };

/** Chip order and colors exactly as Browse.dc.html (ids = store DeviceType ids). */
const CAT_CHIPS: Chip<DeviceType | "all">[] = [
  { id: "all", label: "الكل" },
  { id: "cam", label: "كاميرا" },
  { id: "rotary", label: "روتاري" },
  { id: "micro", label: "ميكرو موتور" },
  { id: "loupe", label: "لوب تكبير" },
  { id: "cure", label: "لايت كيور" },
  { id: "unit", label: "يونيت أسنان" },
  { id: "xray", label: "أشعة" },
  { id: "autoclave", label: "أوتوكلاف" },
  { id: "surg", label: "موتور جراحة وزراعة" },
  { id: "apex", label: "أبيكس لوكيتور" },
  { id: "contra", label: "كونترا" },
  { id: "iocam", label: "كاميرا إنترا أورال" },
  { id: "other", label: "جهاز تاني" },
];
const TOP = ["cam", "rotary", "micro", "loupe", "cure"];

const ST_CHIPS: Chip<Filters["st"]>[] = [
  { id: "all", label: "الكل" },
  { id: "done", label: "تم الفحص" },
  { id: "order", label: "يُفحص عند الطلب" },
];
const MAINT_CHIPS: Chip<Filters["maint"]>[] = [
  { id: "all", label: "الكل" },
  { id: "3", label: "3 شهور" },
  { id: "6", label: "6 شهور" },
];
const COND_CHIPS: Chip<Filters["cond"]>[] = [
  { id: "all", label: "الكل" },
  { id: "a", label: "ممتازة 81–100%" },
  { id: "b", label: "جيدة 60–80%" },
  { id: "c", label: "أقل من 60%" },
];

function chipColors(on: boolean, id: string, isCat: boolean) {
  let bg = on ? "#0D5C55" : "#FFFFFF";
  let fg = on ? "#FFFFFF" : "#12221F";
  let bd = on ? "#0D5C55" : "#C9D4CF";
  if (isCat && TOP.includes(id)) bd = "#7DBB4A";
  if (isCat && id === "other") {
    if (on) { bg = "#F2A33A"; bd = "#F2A33A"; fg = "#12221F"; }
    else { bg = "#FBEEDC"; bd = "#F2A33A"; fg = "#6B3A10"; }
  }
  return { bg, fg, bd };
}

function ChipRow<T extends string>({ chips, value, onPick, isCat = false }: { chips: Chip<T>[]; value: T; onPick: (v: T) => void; isCat?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {chips.map((c) => {
        const on = c.id === value;
        const { bg, fg, bd } = chipColors(on, c.id, isCat);
        return (
          <button
            key={c.id}
            type="button"
            className="br-chip"
            onClick={() => onPick(c.id)}
            aria-pressed={on}
            style={{ minHeight: 40, padding: "4px 14px", borderRadius: 999, border: `1px solid ${bd}`, background: bg, color: fg, font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

const ic = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "#0D5C55", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

function Group({ label, icon, last = false, children }: { label: string; icon: ReactNode; last?: boolean; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "18px 0", borderBottom: last ? undefined : "1px solid #E5EBE8" }}>
      <span style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>{icon}{label === "السعر" ? "السعر (ج.م)" : label}</span>
      {children}
    </div>
  );
}

const input = { minHeight: 44, padding: "0 12px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#F5F7F4", font: "inherit", fontSize: 15, color: "#12221F", minWidth: 0 } as const;

export function FilterAside({ f, set, reset }: { f: Filters; set: (p: Partial<Filters>) => void; reset: () => void }) {
  const days = BUSINESS.trialDays;
  return (
    <aside className="br-aside" aria-label="تصفية النتائج" style={{ flex: "1 1 260px", minWidth: 0, boxSizing: "border-box", padding: 22, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid #E5EBE8" }}>
        <span style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg {...ic} width={18} height={18} stroke="currentColor"><path d="M4 5h16l-6 8v5l-4 2v-7z" /></svg>
          </span>
          تصفية
        </span>
        <button type="button" className="br-reset" onClick={reset} style={{ minHeight: 36, padding: "0 12px", border: 0, borderRadius: 10, background: "transparent", color: "#0D5C55", font: "inherit", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg {...ic} width={15} height={15} stroke="currentColor" strokeWidth={2}><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6" /><path d="M4 4v4.6h4.6" /></svg>
          مسح الكل
        </button>
      </div>

      <Group label="حالة الفحص" icon={<svg {...ic}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>}>
        <ChipRow chips={ST_CHIPS} value={f.st} onPick={(st) => set({ st })} />
      </Group>
      <Group label="نوع الجهاز" icon={<svg {...ic}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>}>
        <ChipRow chips={CAT_CHIPS} value={f.cat} onPick={(cat) => set({ cat })} isCat />
      </Group>
      <Group label="مدة الصيانة" icon={<svg {...ic}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></svg>}>
        <ChipRow chips={MAINT_CHIPS} value={f.maint} onPick={(maint) => set({ maint })} />
      </Group>
      <Group label="حالة المنتج" icon={<svg {...ic}><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" /></svg>}>
        <ChipRow chips={COND_CHIPS} value={f.cond} onPick={(cond) => set({ cond })} />
      </Group>
      <Group label="السعر" last icon={<svg {...ic}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#4A5A56" }}>
            من
            <input type="text" className="br-input" inputMode="numeric" value={f.pmin} onChange={(e) => set({ pmin: e.target.value })} placeholder="0" style={input} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#4A5A56" }}>
            لحد
            <input type="text" className="br-input" inputMode="numeric" value={f.pmax} onChange={(e) => set({ pmax: e.target.value })} placeholder="أي سعر" style={input} />
          </label>
        </div>
      </Group>

      <div style={{ padding: 14, borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", fontSize: 14, color: "#0B4A44", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ flex: "none", width: 32, height: 32, borderRadius: 10, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg {...ic} stroke="currentColor"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </span>
        <span>على كل الأجهزة: استبدال أو استرجاع {days} أيام، وضمان تشغيل {days} أيام، وفلوسك محفوظة لحد الاستلام.</span>
      </div>
    </aside>
  );
}
