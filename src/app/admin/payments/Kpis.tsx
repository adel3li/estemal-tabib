import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { RESERVATIONS, type Payment } from "@/lib/demo/orders";
import { netOf } from "./model";

const Ic = ({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) => (
  <span style={{ width: 28, height: 28, borderRadius: 9, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </span>
);

const Unit = () => <span style={{ fontSize: 14, color: "#4A5A56" }}>ج.م</span>;

export function Kpis({ pays }: { pays: Payment[] }) {
  let heldSum = 0, heldN = 0, readySum = 0, readyN = 0, paidSum = 0, paidN = 0;
  pays.forEach((p) => {
    if (p.st === "held" || p.st === "trial" || p.st === "ready") { heldSum += p.amount; heldN++; }
    if (p.st === "ready") { readySum += netOf(p); readyN++; }
    if (p.st === "paid") { paidSum += netOf(p); paidN++; }
  });
  const dep = BUSINESS.buyerReservationDepositEGP;
  return (
    <section aria-label="ملخص المدفوعات" className="pm-kpis">
      <div className="pm-kpi" style={{ borderColor: "#9CCBC2" }}>
        <span className="pm-kpi-l"><Ic bg="#E3F0ED" fg="#0D5C55"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ic>فلوس محفوظة دلوقتي</span>
        <span className="pm-kpi-v">{fmt(heldSum)} <Unit /></span>
        <span className="pm-kpi-s">{heldN} طلب · محفوظ + في التجربة + جاهز</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#EAF5DD" fg="#3F7A1F"><path d="M5 12h14M13 6l6 6-6 6" /></Ic>جاهزة للتحويل</span>
        <span className="pm-kpi-v" style={{ color: "#3F7A1F" }}>{fmt(readySum)} <Unit /></span>
        <span className="pm-kpi-s">صافي {readyN} بايع · فترة التجربة خلصت</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#EEF2F0" fg="#12221F"><path d="M5 12l4 4 10-10" /></Ic>اتحولت الشهر ده</span>
        <span className="pm-kpi-v">{fmt(paidSum)} <Unit /></span>
        <span className="pm-kpi-s">{paidN} تحويل للبايعين · أكتوبر</span>
      </div>
      <div className="pm-kpi">
        <span className="pm-kpi-l"><Ic bg="#FBEEDC" fg="#8A4209"><path d="M6 4h12v16l-6-4-6 4z" /></Ic>عربون {dep} محجوز</span>
        <span className="pm-kpi-v">{fmt(RESERVATIONS.length * dep)} <Unit /></span>
        <span className="pm-kpi-s">{RESERVATIONS.length} حجز بعربون {dep} ج.م</span>
      </div>
    </section>
  );
}
