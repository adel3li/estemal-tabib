import { fmt } from "@/lib/demo/labels";
import type { Order } from "@/lib/demo/orders";
import { OrSymbol } from "./art";
import { FILTERS, inFilter, payView, stepCol, stepView, type Filter } from "./model";

type Props = {
  orders: Order[];
  base: Order[];
  rows: Order[];
  filter: Filter;
  sel: string | null;
  onFilter: (f: Filter) => void;
  onOpen: (id: string) => void;
};

export function OrdersTable({ orders, base, rows, filter, sel, onFilter, onOpen }: Props) {
  return (
    <section className="ad-card" aria-labelledby="or-tbl-h">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 className="ad-h" id="or-tbl-h" style={{ fontWeight: 700 }}>
          <span className="ad-n" style={{ background: "#E3F0ED", color: "#0D5C55" }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>
          </span>
          كل الطلبات
        </h2>
        <span className="ad-hint">{rows.length} من {orders.length} طلبات</span>
      </div>
      <div role="group" aria-label="فلترة بالخطوة" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map(([key, label]) => {
          const on = filter === key;
          return (
            <button
              key={String(key)}
              type="button"
              className="ad-chip"
              onClick={() => onFilter(key)}
              aria-pressed={on}
              style={{ minHeight: 38, padding: "2px 14px", fontSize: 13, border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}
            >
              {label} <span style={{ opacity: 0.75 }}>({base.filter((o) => inFilter(o, key)).length})</span>
            </button>
          );
        })}
      </div>
      <div style={{ overflowX: "auto" }}>
        <div className="or-tbl" role="table" aria-label="الطلبات">
          <div className="or-tr" role="row">
            {["رقم الطلب", "الجهاز", "المشتري", "البايع", "المبلغ", "المدفوع", "الخطوة الحالية"].map((h) => (
              <span key={h} className="or-th" role="columnheader">{h}</span>
            ))}
          </div>
          <div className="or-body" role="rowgroup">
            {rows.map((o) => {
              const on = sel === o.id;
              const [payTxt, payBg, payFg] = payView(o);
              const [stBg, stFg] = stepCol(o);
              const sv = stepView(o);
              return (
                <div
                  key={o.id}
                  className="or-tr"
                  role="row"
                  onClick={() => onOpen(o.id)}
                  aria-selected={on}
                  style={{ background: on ? "#F2F8F6" : "transparent", boxShadow: `inset -3px 0 0 ${on ? "#0D5C55" : "transparent"}` }}
                >
                  <span className="or-td" role="cell">
                    <button type="button" className="or-id" aria-label={`افتح الطلب ${o.id}`}>{o.id}</button>
                    <span className="ad-hint" style={{ display: "block", fontSize: 12 }}>{o.date}</span>
                  </span>
                  <span className="or-td" role="cell">
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <OrSymbol sym={`or-${o.sym}`} size={38} />
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4, minWidth: 0 }}>
                        <span style={{ fontWeight: 600 }}>{o.device}</span>
                        <span className="ad-hint" style={{ fontSize: 12 }}>{o.cat} · {o.gov}</span>
                      </span>
                    </span>
                  </span>
                  <span className="or-td" role="cell">{o.buyer}</span>
                  <span className="or-td" role="cell">{o.seller}</span>
                  <span className="or-td" role="cell" style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                    {fmt(o.amount)} <span style={{ fontSize: 12, color: "#4A5A56", fontWeight: 400 }}>ج.م</span>
                  </span>
                  <span className="or-td" role="cell"><span className="or-pill" style={{ background: payBg, color: payFg }}>{payTxt}</span></span>
                  <span className="or-td" role="cell">
                    <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, whiteSpace: "nowrap" }}>
                        <span className="or-pill" style={{ background: stBg, color: stFg }}>{sv.no}</span>
                        {sv.name}
                      </span>
                      <span className="or-bar" aria-hidden="true">
                        <span style={{ display: "block", height: "100%", width: sv.pct, background: sv.bar, borderRadius: 999 }} />
                      </span>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 28, borderRadius: 16, background: "#F5F7F4", textAlign: "center", color: "#4A5A56", marginTop: 10 }}>مفيش طلبات في الخطوة دي.</div>
        ) : null}
      </div>
    </section>
  );
}
