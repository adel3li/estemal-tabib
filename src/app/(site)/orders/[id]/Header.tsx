import { ORDER_STEPS, STEP_RELEASED, type Order } from "@/lib/orders/orders";
import { pillOf } from "./model";

export function TrackerHeader({ o }: { o: Order }) {
  const pill = pillOf(o);
  const released = o.step >= STEP_RELEASED;
  const shown = Math.min(o.step + 1, ORDER_STEPS.length);
  const curLabel = released ? "اتحوّل للبايع" : o.status !== "active" ? "الطلب اتلغى" : ORDER_STEPS[o.step];
  const state = (i: number) => (i < o.step || released ? "done" : i === o.step ? (o.status === "active" ? "cur" : "bad") : "todo");
  const barCol = { done: "#0CC0DC", cur: "#F5921C", bad: "#B3261E", todo: "#DFE7EA" } as const;
  return (
    <div className="ot-head" style={{ padding: 20, borderRadius: 12, background: "#FFFFFF", border: "1px solid #DFE7EA", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
      <div className="ot-art" style={{ flex: "1 1 280px", maxWidth: 380, minWidth: 0, borderRadius: 8, overflow: "hidden", background: "linear-gradient(180deg,#EEF3F4,#DFE7E9)", aspectRatio: "4 / 3", position: "relative" }}>
        <svg role="img" aria-label="رسم توضيحي للجهاز مع تقرير الفحص" viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}>
          <use href="#ot-auto" />
        </svg>
      </div>
      <div style={{ flex: "999 1 380px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14, padding: "6px 4px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div className="ot-eyebrow">طلب شراء</div>
            <h1 className="ot-h1">متابعة طلبك</h1>
            <div className="ot-sub" style={{ color: "#4A595A" }}>طلب رقم {o.id} · {o.device}</div>
          </div>
          <span role="status" style={{ padding: "8px 16px", borderRadius: 999, background: pill.bg, border: `1px solid ${pill.bd}`, color: pill.fg, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 999, background: pill.dot, boxShadow: `0 0 0 4px ${pill.dot}40` }} />
            {pill.txt}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#4A595A" }}>
            <span style={{ fontWeight: 600, color: "#122022" }}>{curLabel}</span>
            <span className="ot-num">{shown} / {ORDER_STEPS.length}</span>
          </div>
          <div role="img" aria-label={`الخطوة ${shown} من ${ORDER_STEPS.length}`} className="ot-steps">
            {ORDER_STEPS.map((l, i) => (
              <span key={l} title={l} style={{ height: 4, borderRadius: 2, background: barCol[state(i)] }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
