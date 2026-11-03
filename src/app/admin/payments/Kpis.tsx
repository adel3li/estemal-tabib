import { fmt } from "@/lib/demo/labels";
import type { Order } from "@/lib/orders/orders";
import { netOf, type MoneyStatus } from "./model";

const Ic = ({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) => (
  <span style={{ width: 28, height: 28, borderRadius: 9, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </span>
);

const Unit = () => <span style={{ fontSize: 14, color: "#4A5A56" }}>ج.م</span>;

export function Kpis({ rows }: { rows: { o: Order; st: MoneyStatus }[] }) {
  let held = 0, heldN = 0, due = 0, dueN = 0, ready = 0, readyN = 0, paid = 0, paidN = 0;
  rows.forEach(({ o, st }) => {
    if (st === "held" || st === "trial" || st === "ready") { held += o.collected; heldN++; }
    if (st !== "refunded" && st !== "paid" && o.remaining > 0) { due += o.remaining; dueN++; }
    if (st === "ready") { ready += netOf(o); readyN++; }
    if (st === "paid") { paid += netOf(o); paidN++; }
  });
  return (
    <section aria-label="ملخص الفلوس" className="pm-kpis">
      <div className="pm-kpi" style={{ borderColor: "#9CCBC2" }}>
        <span className="pm-kpi-l"><Ic bg="#E3F0ED" fg="#0D5C55"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ic>فلوس محفوظة دلوقتي</span>
        <span className="pm-kpi-v">{fmt(held)} <Unit /></span>
        <span className="pm-kpi-s">{heldN} طلب لسه مخلصش</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#FBEEDC" fg="#8A4209"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="8" /></Ic>باقي على المشترين</span>
        <span className="pm-kpi-v" style={{ color: "#8A4209" }}>{fmt(due)} <Unit /></span>
        <span className="pm-kpi-s">{dueN} طلب لسه عليه فلوس</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#EAF5DD" fg="#3F7A1F"><path d="M5 12h14M13 6l6 6-6 6" /></Ic>جاهزة للتحويل للبايعين</span>
        <span className="pm-kpi-v" style={{ color: "#3F7A1F" }}>{fmt(ready)} <Unit /></span>
        <span className="pm-kpi-s">صافي {readyN} بايع · الضمان خلص</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#EEF2F0" fg="#12221F"><path d="M5 12l4 4 10-10" /></Ic>اتحولت للبايعين</span>
        <span className="pm-kpi-v">{fmt(paid)} <Unit /></span>
        <span className="pm-kpi-s">{paidN} طلب اتقفل</span>
      </div>
    </section>
  );
}
