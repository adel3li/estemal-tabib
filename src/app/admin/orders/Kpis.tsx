import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { heldOf, type Order } from "@/lib/demo/orders";
import { isClosed } from "./model";

export function Kpis({ orders }: { orders: Order[] }) {
  const open = orders.filter((o) => !isClosed(o));
  const held = open.reduce((a, o) => a + heldOf(o), 0);
  const kpis = [
    { label: "طلبات مفتوحة", val: String(open.length), sub: `${open.filter((o) => o.paid === "dep").length} منهم بعربون ${BUSINESS.buyerReservationDepositEGP}`, dot: "#0D5C55" },
    { label: "فلوس محفوظة", val: `${fmt(held)} ج.م`, sub: `متتحولش غير بعد الاستلام + ${BUSINESS.trialDays} أيام`, dot: "#3F7A1F" },
    { label: "في الشحن", val: String(open.filter((o) => o.step === 4 || o.step === 5).length), sub: "شحن أو مستني تأكيد استلام", dot: "#24508F" },
    { label: "في فترة التجربة", val: String(open.filter((o) => o.step === 6).length), sub: "بعدها الفلوس تتحول للبايع", dot: "#F2A33A" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
      {kpis.map((k) => (
        <div key={k.label} className="or-kpi">
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: k.dot }} />
            {k.label}
          </span>
          <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25 }}>{k.val}</span>
          <span style={{ fontSize: 13, color: "#4A5A56" }}>{k.sub}</span>
        </div>
      ))}
    </div>
  );
}
