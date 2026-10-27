"use client";

import { useState } from "react";
import { BUSINESS, sellerNetFromSalePrice } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { ORDER_STEPS, STEP_RELEASED, STEP_SHIPPING, nowLabel, useOrders } from "@/lib/demo/orders";
import { useDemo } from "@/lib/demo/store";
import { OrSprite } from "./art";
import { Kpis } from "./Kpis";
import { OrderDetail } from "./OrderDetail";
import { OrdersTable } from "./OrdersTable";
import { TK, inFilter, type Filter, type Toast } from "./model";
import "./styles.css";

const STAFF = "[اسم الموظف]";

export default function OrdersPage() {
  const { orders, updateOrder, advanceOrder } = useOrders();
  const { getDevice } = useDemo();
  const [sel, setSel] = useState<string | null>("#2043");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [err, setErr] = useState("");

  const query = q.trim();
  const base = orders.filter((o) => !query || `${o.id} ${o.device} ${o.cat}`.includes(query));
  const rows = base.filter((o) => inFilter(o, filter));
  const so = orders.find((o) => o.id === sel) ?? null;

  const advance = () => {
    if (!so) return;
    if (so.step === STEP_SHIPPING && (!so.co.trim() || !so.no.trim())) {
      setErr("قبل ما تحرّكه للاستلام: اكتب شركة الشحن ورقم الشحنة واحفظهم.");
      return;
    }
    let txt = "";
    advanceOrder(so.id, (next) => {
      txt = next >= STEP_RELEASED
        ? `فترة التجربة خلصت · ${fmt(sellerNetFromSalePrice(so.amount))} ج.م اتحولوا للبايع`
        : `الطلب اتحرك لخطوة «${ORDER_STEPS[next]}»`;
      return { when: nowLabel(), txt, who: STAFF, col: next >= STEP_RELEASED ? "#3F7A1F" : "#0D5C55" };
    });
    setErr("");
    setToast({ kind: "ok", txt: `${so.id}: ${txt}.` });
  };

  const payRest = () => {
    if (!so) return;
    updateOrder(so.id, { paid: "full" }, {
      when: nowLabel(),
      txt: `الباقي اتدفع (${fmt(so.amount - BUSINESS.buyerReservationDepositEGP)} ج.م) · بقى دفع كامل ومحفوظ`,
      who: STAFF,
      col: "#3F7A1F",
    });
    setToast({ kind: "ok", txt: `طلب ${so.id} بقى مدفوع كامل.` });
  };

  const tk = TK[toast?.kind ?? "ok"];

  return (
    <>
      <OrSprite />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الطلبات والشحن</div>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.3, fontWeight: 700 }}>الطلبات والشحن</h1>
          <div style={{ color: "#4A5A56" }}>تابع كل طلب في خطواته السبعة، من التأكيد لحد ما الفلوس تتحول للبايع.</div>
        </div>
        <label style={{ minWidth: 280 }}>
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>دوّر في الطلبات</span>
          <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوّر برقم الطلب أو الجهاز" />
        </label>
      </div>

      {toast ? (
        <div role="status" style={{ padding: "14px 18px", borderRadius: 16, background: tk[0], border: `1px solid ${tk[1]}`, color: tk[2], display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: tk[2], color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: 14 }}>{tk[3]}</span>
          <span style={{ flex: 1 }}>{toast.txt}</span>
          <button type="button" className="or-mini" onClick={() => setToast(null)} style={{ border: `1px solid ${tk[1]}`, background: "#FFFFFF", color: "#12221F" }}>تمام</button>
        </div>
      ) : null}

      <Kpis orders={orders} />
      <OrdersTable orders={orders} base={base} rows={rows} filter={filter} sel={sel} onFilter={setFilter} onOpen={(id) => { setSel(id); setErr(""); }} />

      {so ? (
        <OrderDetail
          o={so}
          device={so.deviceId ? getDevice(so.deviceId) : undefined}
          err={err}
          onAdvance={advance}
          onPayRest={payRest}
          onClose={() => { setSel(null); setErr(""); }}
          onError={setErr}
          onShip={(s) => {
            updateOrder(so.id, s, {
              when: nowLabel(),
              txt: `بيانات الشحن اتحدثت: ${s.co} · ${s.no}${s.eta ? ` · التسليم ${s.eta}` : ""}`,
              who: STAFF,
              col: "#24508F",
            });
            setErr("");
            setToast({ kind: "info", txt: `بيانات شحن ${so.id} اتحفظت.` });
          }}
          onNote={(txt) => updateOrder(so.id, {}, { when: nowLabel(), txt, who: STAFF, col: "#F2A33A" })}
        />
      ) : (
        <div className="ad-card" style={{ alignItems: "center", textAlign: "center", padding: 32 }}>
          <div style={{ fontWeight: 700 }}>اختار طلب من الجدول</div>
          <div className="ad-hint">هتشوف خطواته، بيانات الشحن، أرقام الطرفين، وسجل النشاط.</div>
        </div>
      )}
    </>
  );
}
