import type { Inspection } from "@/lib/demo/types";
import { inTab, statusOf, type Tab } from "./model";

export function Kpis({ items, tab, onPick }: { items: Inspection[]; tab: Tab; onPick: (t: Tab) => void }) {
  const kToday = items.filter((it) => inTab(it, "today")).length;
  const kWeek = items.length;
  const kDone = items.filter((it) => statusOf(it) === "pub").length;
  const kLate = items.filter((it) => inTab(it, "late")).length;
  const kRev = items.filter((it) => inTab(it, "review")).length;
  const kNoTech = items.filter((it) => !it.technician && statusOf(it) !== "pub").length;
  const kpis: { key: Tab; label: string; val: number; sub: string; dot: string }[] = [
    { key: "today", label: "النهارده", val: kToday, sub: kNoTech ? `${kNoTech} فحص لسه من غير فني` : "كل المواعيد ليها فني", dot: "#24508F" },
    { key: "all", label: "الأسبوع ده", val: kWeek, sub: `${kDone} اتعمدوا · ${kWeek - kDone} باقيين`, dot: "#0D5C55" },
    { key: "late", label: "متأخر", val: kLate, sub: kLate ? "ميعادهم فات ولسه متفحصوش" : "مفيش حاجة متأخرة", dot: "#B3261E" },
    { key: "review", label: "تقارير محتاجة مراجعة", val: kRev, sub: "اتملت ومستنية اعتماد", dot: "#F2A33A" },
  ];
  return (
    <div className="in-kpis">
      {kpis.map((k) => {
        const on = tab === k.key;
        return (
          <button
            key={k.key}
            type="button"
            className="in-kpi"
            onClick={() => onPick(on ? "all" : k.key)}
            aria-pressed={on}
            style={{ borderColor: on ? "#0D5C55" : "#DCE3DF", boxShadow: on ? "0 0 0 3px rgba(13,92,85,.15)" : "none" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: k.dot }} />
              {k.label}
            </span>
            <span className="in-kpi-v" style={{ fontWeight: 700, lineHeight: 1.2, color: k.key === "late" && k.val > 0 ? "#B3261E" : "#12221F" }}>{k.val}</span>
            <span style={{ fontSize: 13, color: "#4A5A56" }}>{k.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
