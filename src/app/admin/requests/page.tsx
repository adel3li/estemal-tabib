"use client";

import { useRef, useState } from "react";
import { typeLabel } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import { realPhone } from "@/lib/demo/orders";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { RqSprite } from "./art";
import { RequestDetail } from "./RequestDetail";
import { RequestList } from "./RequestList";
import { TABS, TODAY, waMessage, type ReqStatus } from "./model";
import "./styles.css";

export default function RequestsPage() {
  const { state, matchesFor, updateRequest } = useDemo();
  const [tab, setTab] = useState<ReqStatus>("new");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("R-118");
  const [toast, setToast] = useState("");
  const asideRef = useRef<HTMLElement>(null);

  // On phones/tablets the detail sits under the list: bring it into view.
  const narrow = () => window.matchMedia("(max-width: 1023px)").matches;
  const scrollToEl = (el: Element | null) => {
    if (!el || !narrow()) return;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const pick = (id: string) => {
    setSel(id);
    scrollToEl(asideRef.current);
  };
  const backToList = () => scrollToEl(document.getElementById(`rq-item-${sel}`) ?? document.getElementById("rq-tabs"));

  const query = q.trim().replace(/^#/, "");
  const shown = state.requests.filter(
    (r) => r.status === tab && (!query || `${typeLabel(r.deviceType)} ${r.governorate} ${r.id}`.includes(query)),
  );
  const cur = state.requests.find((r) => r.id === sel && r.status === tab) ?? null;
  const m = cur ? matchesFor(cur) : [];

  const send = () => {
    if (!cur) return;
    const msg = waMessage(cur, m, (id) => window.location.origin + routes.device(id));
    window.open(waLink(msg, realPhone(cur.phone)), "_blank", "noopener,noreferrer");
    updateRequest(cur.id, { status: "notified", notifiedAt: TODAY });
    setToast(`اتبعت لـ${cur.fullName} على واتساب — الطلب #${cur.id} اتنقل لـ«اتبلّغ».`);
    setTab("notified");
  };
  const close = () => {
    if (!cur) return;
    updateRequest(cur.id, { status: "closed" });
    setToast(`الطلب #${cur.id} اتقفل.`);
    setTab("closed");
  };
  const reopen = () => {
    if (!cur) return;
    const back: ReqStatus = cur.notifiedAt ? "notified" : "new";
    updateRequest(cur.id, { status: back });
    setToast(`الطلب #${cur.id} اتفتح تاني.`);
    setTab(back);
  };

  return (
    <>
      <RqSprite />
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › طلبات «اطلب جهاز»</div>
        <h1 className="rq-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>طلبات «اطلب جهاز»</h1>
        <div style={{ color: "#4A5A56" }}>دكاترة بيدوروا على جهاز معيّن. شوف المطابق من الأجهزة المعروضة وبلّغهم على واتساب.</div>
      </div>

      {toast ? (
        <div role="status" className="rq-toast" style={{ padding: "12px 16px", borderRadius: 14, background: "#EAF5DD", color: "#2F5E16", border: "1px solid #BFDCA5", display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
          <span style={{ flex: "1 1 auto" }}>{toast}</span>
          <button type="button" className="rq-link rq-x" onClick={() => setToast("")} aria-label="اقفل الرسالة" style={{ color: "inherit" }}>✕</button>
        </div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div role="tablist" id="rq-tabs" aria-label="حالة الطلب" className="rq-tabs">
          {TABS.map(([key, label]) => {
            const on = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                className="rq-tab"
                aria-selected={on}
                onClick={() => { setTab(key); setSel(""); }}
                style={{ border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}
              >
                {label}
                <span className="rq-cnt" style={{ background: on ? "#FFFFFF" : "#EEF2F0", color: on ? "#0D5C55" : "#4A5A56" }}>
                  {state.requests.filter((r) => r.status === key).length}
                </span>
              </button>
            );
          })}
        </div>
        <label className="rq-search">
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث في الطلبات</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5A56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 12, top: 14 }}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
          <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="نوع الجهاز أو المحافظة" style={{ paddingRight: 38 }} />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <RequestList reqs={shown} sel={sel} query={query} matchesFor={matchesFor} onPick={pick} />
        <aside ref={asideRef} aria-label="تفاصيل الطلب" className="rq-aside">
          {cur ? (
            <RequestDetail r={cur} matches={m} onSend={send} onClose={close} onReopen={reopen} onBack={backToList} />
          ) : (
            <div className="ad-card" style={{ alignItems: "center", textAlign: "center", color: "#4A5A56", padding: "40px 20px" }}>
              <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9FB2AB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              اختار طلب من القائمة عشان تشوف الأجهزة المطابقة.
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
