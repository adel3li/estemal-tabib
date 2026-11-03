"use client";

// «الجدول المالي» (docs/ADMIN_SPEC.md §8, §9): every order's money — paid,
// remaining, method, expected dates, inspection — from the database.
// Layout from design-reference/Admin-Payments.dc.html; actions live on the
// order page (rows link there).
import Link from "next/link";
import { useMemo, useState } from "react";
import { BUSINESS } from "@/config/business";
import { INSPECTION_LABEL, fmt } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import { methodLabel, useOrders, type Order } from "@/lib/orders/orders";
import { downloadCsv, fileDate } from "@/lib/export";
import { routes } from "@/lib/routes";
import { whenAr } from "@/lib/submissions/db";
import { PmIcon, PmSprite } from "./art";
import { Reservations, SellerFees } from "./FeesDeposits";
import { Kpis } from "./Kpis";
import { ST, TABS, iconOf, moneyStatus, netOf, type MoneyStatus, type Tab } from "./model";
import "./styles.css";

const day = (iso?: string) => (iso ? whenAr(iso).split("،")[0] : "");

function timeline(o: Order, st: MoneyStatus): [string, string] {
  if (st === "refunded") return ["—", ""];
  if (st === "paid") return ["اتقفل", o.deliveredAt ? `استلم ${day(o.deliveredAt)}` : ""];
  if (o.trialEndsAt) return [`الضمان لحد ${day(o.trialEndsAt)}`, o.deliveredAt ? `استلم ${day(o.deliveredAt)}` : ""];
  return [o.eta ? `التسليم المتوقع ${o.eta}` : "لسه متشحنش", o.location || ""];
}

export default function PaymentsPage() {
  const { ready: storeReady, state } = useDemo();
  const api = useOrders();
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [now] = useState(() => Date.now());

  // Seller net from the listing (fixed amount) — same as the orders page.
  const rows = useMemo(
    () =>
      api.orders.map((raw) => {
        const dev = state.devices.find((d) => d.dbId === raw.deviceDbId);
        const o: Order = { ...raw, sellerNet: dev?.sellerNet, sellerCo: dev?.source === "company" };
        return { o, st: moneyStatus(o, now) };
      }),
    [api.orders, state.devices, now],
  );
  const query = q.trim().replace("#", "");
  const list = rows.filter(({ o, st }) => (tab === "all" || st === tab) && (!query || `${o.id} ${o.device} ${o.buyer} ${o.buyerPhone}`.includes(query)));
  const count = (t: Tab) => (t === "all" ? rows.length : rows.filter((r) => r.st === t).length);

  return (
    <>
      <PmSprite />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الجدول المالي</div>
        <h1 className="pm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الجدول المالي</h1>
        <div style={{ color: "#4A5A56" }}>اتدفع كام وفاضل كام في كل طلب. فلوس المشتري بتفضل محفوظة لحد الاستلام + {BUSINESS.trialDays} أيام ضمان، وبعدها بتتحوّل للبايع.</div>
      </div>
        <button
          type="button"
          className="ad-btn ad-sec"
          disabled={!rows.length}
          onClick={() =>
            downloadCsv(
              `الجدول-المالي-${fileDate()}`,
              ["الطلب", "التاريخ", "الجهاز", "المشتري", "الموبايل", "السعر", "طريقة الدفع", "اتدفع", "الباقي", "صافي البايع", "الحالة", "الفحص", "استلم", "الضمان لحد"],
              rows.map(({ o, st }) => [o.id, o.date, o.device, o.buyer, o.buyerPhone, o.amount, methodLabel(o.payMethod), o.collected, o.remaining, o.sellerCo ? "" : netOf(o), ST[st][0], INSPECTION_LABEL[o.insp], o.deliveredAt ? day(o.deliveredAt) : "", o.trialEndsAt ? day(o.trialEndsAt) : ""]),
            )
          }
        >
          نزّل Excel (CSV)
        </button>
      </div>

      {!api.ready || !storeReady ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل…</div>
      ) : (
        <>
          <Kpis rows={rows} />

          <section className="ad-card" aria-labelledby="pm-tbl" style={{ padding: 0, gap: 0, overflow: "hidden" }}>
            <div className="pm-tbl-top" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h2 className="ad-h" id="pm-tbl" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#E3F0ED", color: "#0D5C55" }}>١</span>فلوس الطلبات</h2>
                <label className="pm-search">
                  <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث في الطلبات</span>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5A56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 12, top: 14 }}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
                  <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="رقم الطلب، الجهاز، أو المشتري" style={{ paddingRight: 38 }} />
                </label>
              </div>
              <div role="tablist" aria-label="فلترة حسب الحالة" className="pm-tabs">
                {TABS.map(([key, label]) => {
                  const on = tab === key;
                  return (
                    <button key={key} type="button" role="tab" className="pm-tab" aria-selected={on} onClick={() => setTab(key)}
                      style={{ border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}>
                      {label}
                      <span className="pm-cnt" style={{ background: on ? "#FFFFFF" : "#EEF2F0", color: on ? "#0D5C55" : "#4A5A56" }}>{count(key)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div aria-hidden="true" className="pm-cols pm-head" style={{ padding: "10px 16px", background: "#F5F7F4", fontSize: 13, fontWeight: 700, color: "#4A5A56", borderTop: "1px solid #E5EBE8" }}>
                <span>الطلب</span><span>المشتري</span><span>السعر والطريقة</span><span>اتدفع / الباقي</span><span>المواعيد والفحص</span>
                <span>صافي البايع</span><span>الحالة</span><span />
              </div>
              {list.map(({ o, st }) => {
                const [stTxt, stBg, stFg] = ST[st];
                const [t1, t2] = timeline(o, st);
                return (
                  <Link key={o.id} href={`${routes.admin.orders}?open=${encodeURIComponent(o.id)}`} className="pm-row pm-cols" style={{ color: "inherit", display: "grid" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <PmIcon icon={iconOf(o)} />
                      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 700 }}>{o.id}</span>
                        <span className="pm-sub" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.device}</span>
                      </span>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45, minWidth: 0 }}>
                      <span style={{ fontWeight: 600 }}>{o.buyer}</span>
                      <span className="pm-sub" dir="ltr" style={{ textAlign: "right" }}>{o.buyerPhone}</span>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                      <span style={{ fontWeight: 700 }}>{fmt(o.amount)} ج.م</span>
                      <span className="pm-sub">{methodLabel(o.payMethod)}</span>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                      <span style={{ fontWeight: 600, color: "#3F7A1F" }}>{fmt(o.collected)} ج.م</span>
                      <span className="pm-sub" style={{ color: o.remaining && st !== "refunded" ? "#8A4209" : undefined }}>{st === "refunded" ? "—" : o.remaining ? `باقي ${fmt(o.remaining)}` : "مفيش باقي"}</span>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                      <span style={{ fontSize: 14 }}>{t1}</span>
                      <span className="pm-sub">{[t2, INSPECTION_LABEL[o.insp]].filter(Boolean).join(" · ")}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      <span className="pm-net-l">صافي البايع: </span>
                      {o.sellerCo ? "جهاز الشركة" : `${fmt(netOf(o))} ج.م`}
                    </span>
                    <span><span className="pm-pill" style={{ background: stBg, color: stFg }}><span className="pm-dot" />{stTxt}</span></span>
                    <span aria-hidden="true" style={{ color: "#4A5A56" }}>‹</span>
                  </Link>
                );
              })}
              {list.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#4A5A56", borderTop: "1px solid #E5EBE8" }}>
                  {rows.length ? `مفيش طلبات بالحالة دي${query ? " بالبحث ده" : ""}.` : "لسه مفيش طلبات. سجّلها من «الطلبات والشحن»."}
                </div>
              ) : null}
            </div>
          </section>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
            <SellerFees subs={state.submissions} />
            <Reservations orders={api.orders} />
          </div>
        </>
      )}
    </>
  );
}
