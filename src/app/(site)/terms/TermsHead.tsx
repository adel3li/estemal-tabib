import Link from "next/link";
import { routes } from "@/lib/routes";

export type TermsTab = "sell" | "buy";

const SH = "0 4px 12px rgba(10,126,153, 0.25)";

export function TermsHead({ tab, onTab }: { tab: TermsTab; onTab: (t: TermsTab) => void }) {
  const sell = tab === "sell";
  return (
    <>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0", fontSize: 14, color: "#4A595A", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      <Link href={routes.home} className="tm-crumb">الرئيسية</Link>
      <span aria-hidden="true">›</span>
      <span>شروط البيع والشراء</span>
    </div>
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px 0" }}>
      <div style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3E1", boxShadow: "0 10px 30px rgba(15,42,51, 0.06)", overflow: "hidden", display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
        <div className="tm-head" style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ alignSelf: "flex-start", padding: "4px 12px", borderRadius: 999, background: "#E2F4F8", color: "#0A7E99", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              استعمال طبيب
            </span>
            <h1 className="tm-h1" style={{ margin: 0 }}>شروط البيع والشراء</h1>
            <p style={{ margin: 0, color: "#4A595A", display: "flex", alignItems: "center", gap: 6 }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
              آخر تحديث: 1 نوفمبر 2026
            </p>
          </div>
          <div role="tablist" aria-label="نوع الشروط" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6, padding: 6, borderRadius: 18, background: "#F3F6F7", border: "1px solid #DCE3E1", maxWidth: 460 }}>
            <button type="button" role="tab" id="tm-tab-sell" aria-controls="tm-panel-sell" aria-selected={sell} onClick={() => onTab("sell")} className="tm-tab" style={{ minHeight: 52, padding: "0 18px", borderRadius: 13, border: 0, background: sell ? "#0A7E99" : "transparent", color: sell ? "#FFFFFF" : "#122022", boxShadow: sell ? SH : "none", font: "inherit", fontSize: 17, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {/* Hand receiving coins: the seller gets paid (client asked for a clearer seller icon). */}
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                <path d="M7 21l1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                <path d="M2 16l6 6" />
                <circle cx="16" cy="9" r="2.9" />
                <circle cx="6" cy="5" r="3" />
              </svg>
              للبايع
            </button>
            <button type="button" role="tab" id="tm-tab-buy" aria-controls="tm-panel-buy" aria-selected={!sell} onClick={() => onTab("buy")} className="tm-tab" style={{ minHeight: 52, padding: "0 18px", borderRadius: 13, border: 0, background: sell ? "transparent" : "#0A7E99", color: sell ? "#122022" : "#FFFFFF", boxShadow: sell ? "none" : SH, font: "inherit", fontSize: 17, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4h2l2.4 11h11L21 7H6.2" />
                <circle cx="9" cy="19.5" r="1.5" />
                <circle cx="17" cy="19.5" r="1.5" />
              </svg>
              للمشتري
            </button>
          </div>
        </div>
        <div className="tm-hero-art" style={{ flex: "1 1 300px", minWidth: 0, background: "#E7EDEC" }}>
          <svg role="img" aria-label="رسم توضيحي لمستند شروط ودرع حماية" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%" }}><use href="#tm-hero" /></svg>
        </div>
      </div>
    </section>
    </>
  );
}
