"use client";

import { useRef, useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { PAYMENTS, type Payment } from "@/lib/demo/orders";
import { useDemo } from "@/lib/demo/store";
import type { Submission } from "@/lib/demo/types";
import { PmSprite } from "./art";
import { Reservations, SellerFees } from "./FeesDeposits";
import { Kpis } from "./Kpis";
import { PaymentRow } from "./PaymentRow";
import { NET_FACTOR, TABS, TODAY, netOf, type Tab, type Toast } from "./model";
import "./styles.css";

export default function PaymentsPage() {
  const { state, updateSubmission } = useDemo();
  // Held payments are Phase 2 demo data (local to this page).
  const [pays, setPays] = useState<Payment[]>(PAYMENTS);
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState("2051");
  const [toast, setToast] = useState<Toast | null>(null);
  // Receipt files stay in memory (demo — no upload).
  const receipts = useRef<Record<string, File>>({});

  const patch = (id: string, ch: Partial<Payment>, t: Toast) => {
    setPays((all) => all.map((p) => (p.id === id ? { ...p, ...ch } : p)));
    setToast(t);
  };

  const query = q.trim().replace("#", "");
  const list = pays.filter((p) => (tab === "all" || p.st === tab) && (!query || `${p.id} ${p.device} ${p.buyer} ${p.method}`.includes(query)));
  const count = (t: Tab) => (t === "all" ? pays.length : pays.filter((p) => p.st === t).length);
  const fees = state.submissions;

  const refundFee = (s: Submission) => {
    updateSubmission(s.id, { feeStatus: "refunded" }, { text: `رسوم الجدية ${BUSINESS.sellerSeriousnessFeeEGP} ج.م اترجعت`, tone: "info" });
    setToast({ txt: `اترجعت رسوم الجدية ${BUSINESS.sellerSeriousnessFeeEGP} ج.م على طلب بيع ${s.id}.` });
  };

  return (
    <>
      <PmSprite />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › المدفوعات المحفوظة</div>
          <h1 className="pm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>المدفوعات المحفوظة</h1>
          <div style={{ color: "#4A5A56" }}>فلوس المشتري بتفضل محفوظة عندنا لحد الاستلام + {BUSINESS.trialDays} أيام تجربة، وبعدها بتتحوّل للبايع.</div>
        </div>
        <div style={{ fontSize: 14, color: "#4A5A56", display: "flex", alignItems: "center", gap: 6 }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
          النهارده: {TODAY}
        </div>
      </div>

      {toast ? (
        <div
          role="status" className="pm-toast"
          style={{
            padding: "12px 16px", borderRadius: 14,
            background: toast.bad ? "#FBE9E7" : "#EAF5DD", color: toast.bad ? "#7A1A14" : "#2F5E16",
            border: `1px solid ${toast.bad ? "#E8B4AE" : "#BFDCA5"}`,
            display: "flex", alignItems: "center", gap: 10, fontWeight: 600,
          }}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          <span style={{ flex: "1 1 auto" }}>{toast.txt}</span>
          <button type="button" className="pm-link pm-x" onClick={() => setToast(null)} aria-label="اقفل الرسالة" style={{ color: "inherit" }}>✕</button>
        </div>
      ) : null}

      <Kpis pays={pays} />

      <section className="ad-card" aria-labelledby="pm-tbl" style={{ padding: 0, gap: 0, overflow: "hidden" }}>
        <div className="pm-tbl-top" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h2 className="ad-h" id="pm-tbl" style={{ fontWeight: 700 }}><span className="ad-n" style={{ background: "#E3F0ED", color: "#0D5C55" }}>١</span>فلوس الطلبات</h2>
            <label className="pm-search">
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث في المدفوعات</span>
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
            <span>الطلب</span><span>المشتري</span><span>المبلغ والطريقة</span><span>وصلت / الاستلام</span><span>فترة التجربة</span>
            <span>صافي البايع {NET_FACTOR}</span><span>الحالة</span><span />
          </div>
          {list.map((p) => (
            <PaymentRow
              key={`${p.id}-${open === p.id}`}
              p={p}
              open={open === p.id}
              onToggle={() => setOpen(open === p.id ? "" : p.id)}
              onConfirm={(ref, file) => {
                if (file) receipts.current[p.id] = file;
                patch(p.id, { st: "held", recv: TODAY, ref, receipt: file?.name ?? "" }, { txt: `اتأكد وصول ${fmt(p.amount)} ج.م لطلب #${p.id} — الفلوس محفوظة دلوقتي.` });
              }}
              onDeliver={() => patch(p.id, { st: "trial", deliv: TODAY, left: BUSINESS.trialDays }, { txt: `اتسجّل استلام طلب #${p.id} — فترة التجربة ${BUSINESS.trialDays} أيام بدأت.` })}
              onTransfer={() => p.st === "ready" && patch(p.id, { st: "paid", doneOn: TODAY }, { txt: `اتحوّل ${fmt(netOf(p))} ج.م للبايع على طلب #${p.id}.` })}
              onRefund={() => patch(p.id, { st: "refunded", doneOn: TODAY }, { txt: `اترجع ${fmt(p.amount)} ج.م للمشتري على طلب #${p.id}.`, bad: true })}
            />
          ))}
          {list.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#4A5A56", borderTop: "1px solid #E5EBE8" }}>مفيش مدفوعات بالحالة دي{query ? " بالبحث ده" : ""}.</div>
          ) : null}
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <SellerFees subs={fees} onRefund={refundFee} />
        <Reservations />
      </div>
    </>
  );
}
