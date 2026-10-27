import { typeLabel } from "@/lib/demo/labels";
import type { Inspection } from "@/lib/demo/types";
import { InSymbol, symFor } from "./art";
import { DAYS, ST, TABS, TECHS, TODAY, inTab, statusOf, typePill, type Tab } from "./model";

type Props = {
  items: Inspection[];
  base: Inspection[];
  rows: Inspection[];
  tab: Tab;
  day: number;
  sel: string | null;
  onTab: (t: Tab) => void;
  onDay: (d: number) => void;
  onOpen: (id: string) => void;
  onAssign: (it: Inspection, tech: string) => void;
};

const CalIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16" /><path d="M9 3v4" /><path d="M15 3v4" />
  </svg>
);

export function WeekList({ items, base, rows, tab, day, sel, onTab, onDay, onOpen, onAssign }: Props) {
  return (
    <section className="ad-card in-list" aria-labelledby="in-list-h" style={{ flex: "999 1 560px", minWidth: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 className="ad-h" id="in-list-h" style={{ fontWeight: 700 }}>
          <span className="ad-n" style={{ background: "#E3F0ED", color: "#0D5C55" }}><CalIcon /></span>
          جدول الأسبوع
        </h2>
        <span className="ad-hint">٢٤ – ٣٠ أكتوبر · النهارده الثلاثاء ٢٧</span>
      </div>

      <div role="group" aria-label="اختار يوم" className="in-days">
        {DAYS.map((d, i) => {
          const on = day === i;
          const n = items.filter((it) => it.day === i).length;
          const isT = i === TODAY;
          return (
            <button
              key={i}
              type="button"
              className="in-day"
              onClick={() => onDay(on ? -1 : i)}
              aria-pressed={on}
              style={{
                border: `1px solid ${on ? "#0D5C55" : isT ? "#9CCBC2" : "#DCE3DF"}`,
                background: on ? "#0D5C55" : isT ? "#E3F0ED" : "#FFFFFF",
                color: on ? "#FFFFFF" : "#12221F",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>{isT ? "النهارده" : d[0]}</span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{d[1]}</span>
              <span
                style={{
                  fontSize: 12,
                  padding: "0 8px",
                  borderRadius: 999,
                  background: on ? "rgba(255,255,255,.2)" : n ? "#F5F7F4" : "transparent",
                  color: on ? "#FFFFFF" : "#4A5A56",
                }}
              >
                {n ? `${n} فحص` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="فلترة الحالة" className="in-tabs">
        {TABS.map(([key, label]) => {
          const on = tab === key;
          return (
            <button
              key={key}
              type="button"
              className="ad-chip"
              onClick={() => onTab(key)}
              aria-pressed={on}
              style={{ border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}
            >
              {label} <span style={{ opacity: 0.75 }}>({base.filter((it) => inTab(it, key)).length})</span>
            </button>
          );
        })}
        {day >= 0 ? (
          <button type="button" className="in-mini" onClick={() => onDay(-1)} style={{ border: "1px dashed #9FB2AB", background: "#F5F7F4", color: "#12221F" }}>
            يوم {DAYS[day][0]} ✕
          </button>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((it) => {
          const st = statusOf(it);
          const [sTxt, sBg, sFg] = ST[st];
          const [tTxt, tBg, tFg] = typePill(it);
          const on = sel === it.id;
          return (
            <div
              key={it.id}
              id={`in-row-${it.id}`}
              className="in-row"
              style={{ borderColor: on ? "#0D5C55" : st === "late" ? "#E8B4AE" : "#DCE3DF", background: on ? "#F2F8F6" : "#FFFFFF" }}
            >
              <button type="button" className="in-open" onClick={() => onOpen(it.id)} aria-label={`افتح تقرير ${it.title}`}>
                <InSymbol sym={symFor(it.deviceType)} size={52} />
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>{it.title}</span>
                  <span style={{ fontSize: 13, color: "#4A5A56" }}>
                    #{it.id} · {it.governorate} — {it.location}
                  </span>
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                    <span className="in-pill" style={{ background: sBg, color: sFg }}>{sTxt}</span>
                    <span className="in-pill" style={{ background: tBg, color: tFg }}>{tTxt}</span>
                  </span>
                </span>
              </button>
              <div className="in-when">
                <span style={{ fontWeight: 700 }}>{it.time}</span>
                <span style={{ fontSize: 13, color: "#4A5A56" }}>{DAYS[it.day][0]} {DAYS[it.day][1]}</span>
              </div>
              <label className="in-tech">
                اسم الفني
                <select
                  className="in-sel"
                  value={it.technician}
                  onChange={(e) => onAssign(it, e.target.value)}
                  aria-label={`اختار الفني لـ ${it.title} (${typeLabel(it.deviceType)})`}
                  style={{ borderColor: it.technician ? "#C9D4CF" : "#F0C88A" }}
                >
                  <option value="">— من غير فني —</option>
                  {TECHS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
        {rows.length === 0 ? (
          <div style={{ padding: 28, borderRadius: 16, background: "#F5F7F4", textAlign: "center", color: "#4A5A56" }}>مفيش فحوصات بالفلتر ده.</div>
        ) : null}
      </div>
    </section>
  );
}
