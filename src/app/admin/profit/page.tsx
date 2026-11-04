"use client";

// «الأرباح» — per-device expenses and net profit (docs/ADMIN_SPEC.md §8),
// Super Admin only. Profit per sale = sale price − seller's net (or purchase
// cost for company devices) − expenses (shipping, inspection, maintenance…).
// Kept fees / deposits are separate income lines (open point F).
// Not in the design files — built from the admin card/table styles.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sellerNetFromSalePrice } from "@/config/business";
import { fmt, parseNum } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import { downloadCsv, fileDate } from "@/lib/export";
import { STEP_RELEASED, STEP_TRIAL, useOrders } from "@/lib/orders/orders";
import { routes } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

type Expense = { id: number; device_id: string; kind: Kind; amount: number; note: string | null; created_at: string };
type Kind = "shipping" | "inspection" | "maintenance" | "other";
const KIND: Record<Kind, string> = { shipping: "شحن", inspection: "فحص", maintenance: "صيانة", other: "تاني" };

export default function ProfitPage() {
  const { ready, state } = useDemo();
  const orders = useOrders();
  const [exp, setExp] = useState<Expense[] | null>(null);
  const [dev, setDev] = useState("");
  const [kind, setKind] = useState<Kind>("shipping");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser().from("device_expenses").select("id, device_id, kind, amount, note, created_at").order("created_at", { ascending: false });
    setExp((data ?? []) as Expense[]);
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  // One row per order that wasn't cancelled / returned.
  const rows = useMemo(
    () =>
      orders.orders
        .filter((o) => o.status === "active")
        .map((o) => {
          const d = state.devices.find((x) => x.dbId === o.deviceDbId);
          const company = d?.source === "company";
          const units = o.quantity ?? 1;
          const cost = company ? (d?.purchaseCost ?? 0) * units : d?.sellerNet ? d.sellerNet * units : sellerNetFromSalePrice(o.amount);
          const items = (exp ?? []).filter((e) => e.device_id === o.deviceDbId);
          const spent = items.reduce((a, e) => a + e.amount, 0);
          return {
            o,
            d,
            company,
            cost,
            items,
            spent,
            net: o.amount - cost - spent,
            done: o.step >= STEP_RELEASED,
            sold: o.step >= STEP_TRIAL,
          };
        }),
    [orders.orders, state.devices, exp],
  );
  // Devices with expenses but no order yet (still on sale).
  const unsold = useMemo(() => {
    const withOrder = new Set(rows.map((r) => r.o.deviceDbId));
    const ids = [...new Set((exp ?? []).map((e) => e.device_id))].filter((id) => !withOrder.has(id));
    return ids.map((id) => ({ d: state.devices.find((x) => x.dbId === id), spent: (exp ?? []).filter((e) => e.device_id === id).reduce((a, e) => a + e.amount, 0) }));
  }, [exp, rows, state.devices]);

  const closed = rows.filter((r) => r.done);
  const profitDone = closed.reduce((a, r) => a + r.net, 0);
  const profitOpen = rows.filter((r) => !r.done).reduce((a, r) => a + r.net, 0);
  const feesKept = state.submissions.filter((s) => s.feeStatus === "forfeited").reduce((a, s) => a + (s.feeAmount ?? 0), 0);
  // Money kept from cancelled / returned orders (deposit not refunded).
  const depositsKept = orders.orders.filter((o) => o.status !== "active").reduce((a, o) => a + Math.max(0, o.collected), 0);
  const unsoldSpent = unsold.reduce((a, u) => a + u.spent, 0);

  const addExpense = async () => {
    const n = Math.round(parseNum(amount));
    if (!dev || !n) {
      setMsg("اختار الجهاز واكتب المبلغ.");
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser().from("device_expenses").insert({ device_id: dev, kind, amount: n, note: note.trim() || null });
    setBusy(false);
    if (error) {
      setMsg("ما قدرناش نحفظ المصروف. جرّب تاني.");
      return;
    }
    setAmount("");
    setNote("");
    setMsg(`اتسجل مصروف ${KIND[kind]} ${fmt(n)} ج.م.`);
    await load();
  };
  const remove = async (id: number) => {
    await supabaseBrowser().from("device_expenses").delete().eq("id", id);
    await load();
  };

  const exportCsv = () =>
    downloadCsv(
      `الأرباح-${fileDate()}`,
      ["الطلب", "الجهاز", "النوع", "سعر البيع", "صافي البايع / تكلفة الشراء", "المصاريف", "صافي الربح", "الحالة"],
      rows.map((r) => [r.o.id, r.o.device, r.company ? "جهاز الشركة" : "جهاز بايع", r.o.amount, r.cost, r.spent, r.net, r.done ? "اتقفل" : r.sold ? "في الضمان" : "لسه ماشي"]),
    );

  const devices = state.devices.filter((d) => d.dbId && d.status !== "draft");

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الأرباح</div>
          <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الأرباح</h1>
          <div style={{ color: "#4A5A56" }}>صافي الربح لكل جهاز = سعر البيع − صافي البايع (أو تكلفة الشراء لأجهزة الشركة) − المصاريف.</div>
        </div>
        <button type="button" className="ad-btn ad-sec" onClick={exportCsv} disabled={!rows.length}>نزّل Excel (CSV)</button>
      </div>

      {!ready || !orders.ready || !exp ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل…</div>
      ) : (
        <>
          <div className="hm-kpis">
            <div className="hm-kpi"><span>ربح الطلبات اللي اتقفلت</span><b style={{ color: profitDone >= 0 ? "#3F7A1F" : "#B3261E" }}>{fmt(profitDone)} <small>ج.م</small></b></div>
            <div className="hm-kpi"><span>ربح متوقع (طلبات لسه ماشية)</span><b>{fmt(profitOpen)} <small>ج.م</small></b></div>
            <div className="hm-kpi"><span>رسوم جدية اتخصمت (دخل)</span><b>{fmt(feesKept)} <small>ج.م</small></b></div>
            <div className="hm-kpi"><span>فلوس فضلت من طلبات اتلغت / مرتجع</span><b>{fmt(depositsKept)} <small>ج.م</small></b></div>
          </div>

          <section className="ad-card" aria-labelledby="pf-add" style={{ gap: 12 }}>
            <h2 className="ad-h" id="pf-add" style={{ fontWeight: 700 }}>سجّل مصروف على جهاز</h2>
            <div className="ad-grid">
              <label className="ad-field">
                الجهاز
                <select className="ad-in" value={dev} onChange={(e) => setDev(e.target.value)}>
                  <option value="">اختار…</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.dbId}>{d.id} · {d.title}</option>
                  ))}
                </select>
              </label>
              <label className="ad-field">
                النوع
                <select className="ad-in" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
                  {(Object.keys(KIND) as Kind[]).map((k) => <option key={k} value={k}>{KIND[k]}</option>)}
                </select>
              </label>
              <label className="ad-field">
                المبلغ (ج.م)
                <input type="text" inputMode="numeric" className="ad-in" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <label className="ad-field">
                ملاحظة (اختياري)
                <input type="text" className="ad-in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: شحن للمقر" />
              </label>
            </div>
            {msg ? <div role="status" className="ad-hint" style={{ fontWeight: 600 }}>{msg}</div> : null}
            <div><button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void addExpense()}>سجّل المصروف</button></div>
          </section>

          <section className="ad-card" aria-labelledby="pf-tbl" style={{ gap: 12 }}>
            <h2 className="ad-h" id="pf-tbl" style={{ fontWeight: 700 }}>الربح لكل طلب</h2>
            {rows.length ? (
              <div className="hm-tbl" role="table" aria-label="الربح لكل طلب">
                <div className="hm-tr hm-th" role="row" style={{ gridTemplateColumns: "1.6fr 1fr 1.2fr 1.4fr 1fr" }}>
                  {["الطلب", "سعر البيع", "صافي البايع / الشراء", "المصاريف", "صافي الربح"].map((h) => <span key={h} role="columnheader">{h}</span>)}
                </div>
                {rows.map((r) => (
                  <div key={r.o.id} className="hm-tr" role="row" style={{ gridTemplateColumns: "1.6fr 1fr 1.2fr 1.4fr 1fr" }}>
                    <span role="cell" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <Link href={`${routes.admin.orders}?open=${encodeURIComponent(r.o.id)}`} style={{ fontWeight: 700, color: "#0D5C55" }}>{r.o.id}</Link>
                      <span className="hm-sub">{r.o.device} · {r.done ? "اتقفل" : r.sold ? "في الضمان" : "لسه ماشي"}</span>
                    </span>
                    <span role="cell" data-l="سعر البيع">{fmt(r.o.amount)} ج.م</span>
                    <span role="cell" data-l={r.company ? "تكلفة الشراء" : "صافي البايع"}>
                      {fmt(r.cost)} ج.م{r.company && !r.d?.purchaseCost ? <span className="hm-sub"> (مش متسجلة)</span> : null}
                    </span>
                    <span role="cell" data-l="المصاريف" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span>{fmt(r.spent)} ج.م</span>
                      {r.items.map((e) => (
                        <span key={e.id} className="hm-sub">
                          {KIND[e.kind]} {fmt(e.amount)}{e.note ? ` · ${e.note}` : ""}{" "}
                          <button type="button" onClick={() => void remove(e.id)} aria-label={`امسح مصروف ${KIND[e.kind]} ${fmt(e.amount)}`} style={{ border: 0, background: "none", color: "#B3261E", cursor: "pointer", font: "inherit", padding: "0 4px", minHeight: 24 }}>✕</button>
                        </span>
                      ))}
                    </span>
                    <b role="cell" data-l="صافي الربح" style={{ color: r.net >= 0 ? "#3F7A1F" : "#B3261E" }}>{fmt(r.net)} ج.م</b>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hm-empty">لسه مفيش طلبات.</div>
            )}
            {unsold.length ? (
              <div className="ad-hint">مصاريف على أجهزة لسه متباعتش: {unsold.map((u) => `${u.d?.id ?? "؟"} (${fmt(u.spent)} ج.م)`).join("، ")} — إجمالي {fmt(unsoldSpent)} ج.م.</div>
            ) : null}
          </section>
        </>
      )}
    </>
  );
}
