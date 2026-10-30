"use client";

import Link from "next/link";
import { CONDITIONS, fmt, INSPECTION_LABEL, typeLabel } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";

export function RequestSuccess({ id, onAgain }: { id: string; onAgain: () => void }) {
  const { state, matchesFor } = useDemo();
  const req = state.requests.find((r) => r.id === id);
  const matches = req ? matchesFor(req) : [];

  return (
    <section className="rq-done">
      <div className="rq-done-card" style={{ borderRadius: 28, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        <span style={{ width: 96, height: 96, borderRadius: 999, background: "#E3F0ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 68, height: 68, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </span>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>وصلنا طلبك</h1>
        <span style={{ padding: "4px 16px", borderRadius: 999, background: "#F5F7F4", border: "1px solid #DCE3DF", fontWeight: 700, fontSize: 15 }}>
          رقم الطلب: <span dir="ltr" data-testid="request-id">{id}</span>
        </span>
        <p style={{ margin: 0, color: "#4A5A56", fontSize: 17 }}>أول ما يتعرض جهاز مناسب لمواصفاتك وميزانيتك، هنبعتلك على واتساب.</p>

        {req ? (
          <div style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: 18, borderRadius: 18, background: "#F5F7F4", display: "flex", flexDirection: "column", gap: 10, textAlign: "right" }}>
            <span style={{ fontWeight: 700, fontSize: 16 }} data-testid="match-count">
              {matches.length
                ? `فيه ${matches.length === 1 ? "جهاز واحد معروض" : `${matches.length} أجهزة معروضة`} دلوقتي ممكن ${matches.length === 1 ? "يناسبك" : "تناسبك"}:`
                : `مفيش ${typeLabel(req.deviceType)} معروض دلوقتي بالمواصفات دي، وهنبلغك أول ما يتعرض.`}
            </span>
            {matches.slice(0, 5).map((d) => (
              <Link key={d.id} href={routes.device(d.id)} className="rq-match">
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4, minWidth: 0 }}>
                  <span style={{ fontWeight: 700 }}>{d.title}</span>
                  <span style={{ fontSize: 13, color: "#4A5A56" }}>
                    {CONDITIONS[d.condition].short} · {INSPECTION_LABEL[d.inspection]}
                  </span>
                </span>
                <span style={{ fontWeight: 700, color: "#0D5C55", flex: "none" }}>{fmt(d.price)} ج.م</span>
              </Link>
            ))}
            <Link href={`${routes.devices}?cat=${req.deviceType}`} className="rq-all" style={{ fontWeight: 600, alignSelf: "flex-start" }}>
              شوف كل أجهزة {typeLabel(req.deviceType)} ←
            </Link>
          </div>
        ) : null}

        <div className="rq-done-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingTop: 6 }}>
          <Link href={routes.devices} className="rq-cta" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>
            ارجع لكل الأجهزة
          </Link>
          <button type="button" onClick={onAgain} className="rq-ghost" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", fontWeight: 600, cursor: "pointer" }}>
            اطلب جهاز تاني
          </button>
        </div>
      </div>
    </section>
  );
}
