import { ORDER_STEPS, STEP_RELEASED, type Order } from "@/lib/demo/orders";
import { STEP_ICONS } from "./art";
import { pillOf } from "./model";

export function TrackerHeader({ o }: { o: Order }) {
  const pill = pillOf(o);
  const released = o.step >= STEP_RELEASED;
  const shown = Math.min(o.step + 1, ORDER_STEPS.length);
  const curLabel = released ? "اتحوّل للبايع" : o.status !== "active" ? "الطلب اتلغى" : ORDER_STEPS[o.step];
  const state = (i: number) => (i < o.step || released ? "done" : i === o.step ? (o.status === "active" ? "cur" : "bad") : "todo");
  const barCol = { done: "#0D5C55", cur: "#F2A33A", bad: "#B3261E", todo: "#DCE3DF" } as const;
  const tile = {
    done: { background: "#E3F0ED", color: "#0D5C55" },
    cur: { background: "#FBEEDC", color: "#C46A12" },
    bad: { background: "#FBE9E7", color: "#B3261E" },
    todo: { background: "#F5F7F4", color: "#8FA09A" },
  } as const;
  return (
    <div style={{ padding: 20, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
      <div style={{ flex: "1 1 280px", maxWidth: 380, minWidth: 0, borderRadius: 18, overflow: "hidden", border: "1px solid #DCE3DF", aspectRatio: "4 / 3", position: "relative" }}>
        <svg role="img" aria-label="رسم توضيحي للجهاز مع تقرير الفحص" viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}>
          <use href="#ot-auto" />
        </svg>
      </div>
      <div style={{ flex: "999 1 380px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14, padding: "6px 4px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.3, fontWeight: 700 }}>متابعة طلبك</h1>
            <div style={{ color: "#4A5A56" }}>طلب رقم {o.id} · {o.device}</div>
          </div>
          <span role="status" style={{ padding: "8px 16px", borderRadius: 999, background: pill.bg, border: `1px solid ${pill.bd}`, color: pill.fg, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 999, background: pill.dot, boxShadow: `0 0 0 4px ${pill.dot}40` }} />
            {pill.txt}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#4A5A56" }}>
            <span style={{ fontWeight: 600, color: "#12221F" }}>{curLabel}</span>
            <span>{shown} / {ORDER_STEPS.length}</span>
          </div>
          <div role="img" aria-label={`الخطوة ${shown} من ${ORDER_STEPS.length}`} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
            {ORDER_STEPS.map((l, i) => (
              <span key={l} title={l} style={{ height: 8, borderRadius: 999, background: barCol[state(i)] }} />
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }} aria-hidden="true">
          {STEP_ICONS.map((Icon, i) => (
            <span key={i} style={{ height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", ...tile[state(i)] }}>
              <Icon size={18} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
