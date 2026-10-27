import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { fmt, typeLabel } from "@/lib/demo/labels";
import { RESERVATIONS } from "@/lib/demo/orders";
import type { Submission } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const FEE = BUSINESS.sellerSeriousnessFeeEGP;
const DEP = BUSINESS.buyerReservationDepositEGP;

const FEE_ST: Record<Submission["feeStatus"], [string, string, string]> = {
  paid: ["محفوظة", "#FBEEDC", "#8A4209"],
  refunded: ["اترجعت", "#E5EBE8", "#12221F"],
  pending: ["لسه متدفعتش", "#F5F7F4", "#4A5A56"],
  forfeited: ["اتصادرت", "#FBE9E7", "#B3261E"],
};

export function SellerFees({ subs, onRefund }: { subs: Submission[]; onRefund: (s: Submission) => void }) {
  const held = subs.filter((s) => s.feeStatus === "paid").length;
  return (
    <section className="ad-card" aria-labelledby="pm-fee" style={{ flex: "1 1 420px", minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 className="ad-h" id="pm-fee" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#FBEEDC", color: "#8A4209" }}>٢</span>رسوم الجدية من البايعين</h2>
        <span className="pm-pill" style={{ background: "#FBEEDC", color: "#8A4209" }}>{FEE} ج.م لكل طلب بيع</span>
      </div>
      <div className="ad-hint">بتندفع مع طلب البيع، وبترجع حسب <Link href={routes.terms} style={{ fontWeight: 600 }}>الشروط</Link>.</div>
      <div>
        <div className="pm-mini pm-mini-h" style={{ fontSize: 12, fontWeight: 700, color: "#4A5A56", borderTop: 0, paddingTop: 0 }}>
          <span>البايع / طلب البيع</span><span>الجهاز</span><span>الحالة</span><span />
        </div>
        {subs.map((s) => {
          const [txt, bg, fg] = FEE_ST[s.feeStatus];
          return (
            <div key={s.id} className="pm-mini">
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                <span style={{ fontWeight: 600 }}>{s.fullName}</span>
                <span className="pm-sub">طلب بيع {s.id} · {s.createdAt}</span>
              </span>
              <span>{typeLabel(s.deviceType)}</span>
              <span><span className="pm-pill" style={{ background: bg, color: fg }}><span className="pm-dot" />{txt}</span></span>
              <span className="pm-fee-act">
                {s.feeStatus === "paid" ? (
                  <button type="button" className="pm-link" onClick={() => onRefund(s)} aria-label={`رجّع رسوم الجدية لـ طلب بيع ${s.id}`}>رجّع الـ {FEE}</button>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "#F5F7F4", fontSize: 14 }}>
        <span>محفوظ من رسوم الجدية</span><span style={{ fontWeight: 700 }}>{fmt(held * FEE)} ج.م</span>
      </div>
    </section>
  );
}

export function Reservations() {
  return (
    <section className="ad-card" aria-labelledby="pm-dep" style={{ flex: "1 1 380px", minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 className="ad-h" id="pm-dep" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#E6EDF7", color: "#24508F" }}>٣</span>حجوزات بعربون</h2>
        <span className="pm-pill" style={{ background: "#E6EDF7", color: "#24508F" }}>عربون {DEP} ج.م</span>
      </div>
      <div className="ad-hint">المشتري يقدر يحجز الجهاز بعربون {DEP} ج.م لحد ما يكمّل.</div>
      <div>
        {RESERVATIONS.map((d) => (
          <div key={d.order} className="pm-mini pm-mini-r">
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
              <span style={{ fontWeight: 600 }}>{d.order}</span>
              <span className="pm-sub">{d.buyer} · {d.date}</span>
            </span>
            <span>{d.device}</span>
            <span className="pm-pill" style={{ background: "#E6EDF7", color: "#24508F" }}><span className="pm-dot" />محجوز · {DEP}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
