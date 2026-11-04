import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { fmt, typeLabel } from "@/lib/demo/labels";
import type { Submission } from "@/lib/demo/types";
import type { Order } from "@/lib/orders/orders";
import { routes } from "@/lib/routes";

const FEE_ST: Record<Submission["feeStatus"], [string, string, string]> = {
  paid: ["محفوظة", "#FBEEDC", "#8A4209"],
  refunded: ["اترجعت", "#E5EBE8", "#12221F"],
  pending: ["لسه متدفعتش", "#F5F7F4", "#4A5A56"],
  forfeited: ["اتخصمت", "#FBE9E7", "#B3261E"],
};
const amountOf = (s: Submission) => s.feeAmount ?? BUSINESS.sellerSeriousnessFeeEGP;

/** Seller seriousness fees (requests that got to the fee stage). */
export function SellerFees({ subs }: { subs: Submission[] }) {
  const list = subs.filter((s) => s.status === "accepted" || s.feeStatus !== "pending");
  const sum = (st: Submission["feeStatus"]) => list.filter((s) => s.feeStatus === st).reduce((a, s) => a + amountOf(s), 0);
  return (
    <section className="ad-card" aria-labelledby="pm-fee" style={{ flex: "1 1 420px", minWidth: 0 }}>
      <h2 className="ad-h" id="pm-fee" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#FBEEDC", color: "#8A4209" }}>٢</span>رسوم الجدية من البايعين</h2>
      <div className="ad-hint">بتتطلب بعد قبول طلب البيع، وبترجع كاملة لما الجهاز يتباع (<Link href={routes.terms} style={{ fontWeight: 600 }}>الشروط</Link>). بتتسجل من «طلبات البيع».</div>
      <div>
        <div className="pm-mini pm-mini-h" style={{ fontSize: 12, fontWeight: 700, color: "#4A5A56", borderTop: 0, paddingTop: 0 }}>
          <span>البايع / طلب البيع</span><span>الجهاز</span><span>الحالة</span><span>المبلغ</span>
        </div>
        {list.map((s) => {
          const [txt, bg, fg] = FEE_ST[s.feeStatus];
          return (
            <div key={s.id} className="pm-mini">
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                <span style={{ fontWeight: 600 }}>{s.fullName}</span>
                <span className="pm-sub">طلب بيع {s.id}</span>
              </span>
              <span>{typeLabel(s.deviceType)}</span>
              <span><span className="pm-pill" style={{ background: bg, color: fg }}><span className="pm-dot" />{txt}</span></span>
              <span className="pm-fee-act" style={{ fontWeight: 700 }}>{fmt(amountOf(s))} ج.م</span>
            </div>
          );
        })}
        {list.length === 0 ? <div className="ad-hint" style={{ padding: "12px 0" }}>لسه مفيش رسوم جدية.</div> : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "6px 12px", padding: "10px 14px", borderRadius: 12, background: "#F5F7F4", fontSize: 14 }}>
        <span>محفوظ من رسوم الجدية</span><span style={{ fontWeight: 700 }}>{fmt(sum("paid"))} ج.م</span>
        {/* ADMIN_SPEC open point F: kept fees are income, shown on their own line. */}
        <span>رسوم اتخصمت (دخل)</span><span style={{ fontWeight: 700, color: "#B3261E" }}>{fmt(sum("forfeited"))} ج.م</span>
      </div>
    </section>
  );
}

/** Orders held by a deposit only (the buyer still owes the rest). */
export function Reservations({ orders }: { orders: Order[] }) {
  const list = orders.filter((o) => o.status === "active" && o.collected > 0 && o.remaining > 0);
  return (
    <section className="ad-card" aria-labelledby="pm-dep" style={{ flex: "1 1 380px", minWidth: 0 }}>
      <h2 className="ad-h" id="pm-dep" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#E6EDF7", color: "#24508F" }}>٣</span>محجوز بعربون</h2>
      <div className="ad-hint">العربون ({fmt(BUSINESS.buyerReservationDepositEGP)} ج.م) بيتخصم من السعر. الباقي بيتسجل من صفحة الطلب.</div>
      <div>
        {list.map((o) => (
          <Link key={o.id} href={`${routes.admin.orders}?open=${encodeURIComponent(o.id)}`} className="pm-mini pm-mini-r" style={{ color: "inherit" }}>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
              <span style={{ fontWeight: 600 }}>طلب {o.id}</span>
              <span className="pm-sub">{o.buyer} · {o.date}</span>
            </span>
            <span>{o.device}</span>
            <span className="pm-pill" style={{ background: "#FBEEDC", color: "#8A4209" }}><span className="pm-dot" />باقي {fmt(o.remaining)}</span>
          </Link>
        ))}
        {list.length === 0 ? <div className="ad-hint" style={{ padding: "12px 0" }}>مفيش طلبات محجوزة بعربون دلوقتي.</div> : null}
      </div>
    </section>
  );
}
