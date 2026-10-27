"use client";

import { fmt } from "@/lib/demo/labels";
import type { Submission, SubmissionStatus } from "@/lib/demo/types";
import { artFor } from "../art";
import { FEE, ST, TABS } from "./meta";

type Props = {
  tab: SubmissionStatus;
  counts: Record<SubmissionStatus, number>;
  onTab: (t: SubmissionStatus) => void;
  q: string;
  onQ: (q: string) => void;
  items: Submission[];
  sel: string | null;
  onPick: (id: string) => void;
};

export function SubmissionList({ tab, counts, onTab, q, onQ, items, sel, onPick }: Props) {
  return (
    <section className="ad-card sb-list" aria-label="قائمة الطلبات" style={{ flex: "0 0 414px", padding: 16, gap: 12, minWidth: 0 }}>
      <div role="tablist" aria-label="حالة الطلب" className="sb-tabs" style={{ display: "flex", gap: 4, padding: 4, borderRadius: 14, background: "#F5F7F4" }}>
        {TABS.map(([key, label]) => {
          const on = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              className="sb-tab"
              onClick={() => onTab(key)}
              aria-selected={on}
              style={{ background: on ? "#FFFFFF" : "transparent", color: on ? "#0D5C55" : "#3C4C48", boxShadow: on ? "0 2px 8px rgba(18,34,31,.08)" : "none" }}
            >
              {label}
              <span
                style={{
                  minWidth: 20,
                  padding: "0 6px",
                  borderRadius: 999,
                  background: on ? "#0D5C55" : "#DCE3DF",
                  color: on ? "#FFFFFF" : "#3C4C48",
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>
      <label style={{ position: "relative", display: "block" }}>
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث في الطلبات</span>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5A56" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", top: 14, right: 12 }}>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.5-4.5" />
        </svg>
        <input type="search" className="ad-in" value={q} onChange={(e) => onQ(e.target.value)} placeholder="رقم الطلب، الجهاز، أو المحافظة" style={{ paddingRight: 38 }} />
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((x) => {
          const on = sel === x.id;
          const st = ST[x.status];
          const fee = FEE[x.feeStatus];
          return (
            <button
              key={x.id}
              type="button"
              className="sb-item"
              onClick={() => onPick(x.id)}
              aria-pressed={on}
              style={{ border: `${on ? "2px" : "1px"} solid ${on ? "#0D5C55" : "#DCE3DF"}`, background: on ? "#F1F8F6" : "#FFFFFF" }}
            >
              <span style={{ width: 60, height: 45, borderRadius: 10, overflow: "hidden", border: "1px solid #DCE3DF", flex: "none" }}>
                <svg aria-hidden="true" viewBox="0 0 120 90" style={{ display: "block", width: "100%", height: "100%" }}>
                  <use href={artFor(x.deviceType)} />
                </svg>
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.45 }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: "#4A5A56" }}>
                  <span>
                    {x.id} · {x.governorate}
                  </span>
                  <span>{x.createdAt}</span>
                </span>
                <span style={{ fontWeight: 700 }}>{x.details}</span>
                <span style={{ fontSize: 13, color: "#3C4C48" }}>
                  {x.fullName} · <span style={{ fontWeight: 700, color: "#12221F" }}>{fmt(x.salePrice)} ج.م</span>
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  <span className="sb-pill" style={{ background: st.bg, color: st.fg }}>
                    {st.l}
                  </span>
                  <span className="sb-pill" style={{ background: fee.bg, color: fee.fg }}>
                    {fee.short}
                  </span>
                  <span className="sb-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>
                    {x.keepLocation === "with_seller" ? "يفضل معايا" : "أبعته يتفحص"}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
        {items.length === 0 ? (
          <div style={{ padding: "32px 12px", textAlign: "center", color: "#4A5A56", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9FB2AB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            <span style={{ fontWeight: 700, color: "#12221F" }}>{q ? "مفيش نتايج للبحث ده" : "مفيش طلبات هنا دلوقتي"}</span>
            <span>{q ? "جرّب كلمة تانية أو امسح البحث." : "الطلبات اللي تتنقل للحالة دي هتظهر هنا."}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
