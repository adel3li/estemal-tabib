import type { ReactNode } from "react";
import type { Device } from "@/lib/demo/types";
import { typeLabel } from "@/lib/demo/labels";
import { defectInfo, svgProps } from "./helpers";

const ic = { "aria-hidden": true, width: 22, height: 22, viewBox: "0 0 24 24", ...svgProps, strokeWidth: 1.8 } as const;
const iconBox = { width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" } as const;

function Summary({ label, value, tone, icon }: { label: string; value: ReactNode; tone: "ok" | "plain" | "warn"; icon: ReactNode }) {
  const t = {
    ok: { bg: "#E3F0ED", bd: "#9CCBC2", lab: "#3C4C48", fg: "#0D5C55" },
    plain: { bg: "#F5F7F4", bd: "#DCE3DF", lab: "#3C4C48", fg: "#12221F" },
    warn: { bg: "#FBEEDC", bd: "#F0C88A", lab: "#6B3A10", fg: "#8A4209" },
  }[tone];
  return (
    <div style={{ padding: 18, borderRadius: 18, background: t.bg, border: `1px solid ${t.bd}`, display: "flex", gap: 14, alignItems: "center" }}>
      {icon}
      <div>
        <div style={{ fontSize: 14, color: t.lab }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: t.fg }}>{value}</div>
      </div>
    </div>
  );
}

export function Report({ d }: { d: Device }) {
  const r = d.report;
  const { count } = defectInfo(d);
  const defects = r ? r.defects : d.declaredDefects ? [d.declaredDefects] : [];
  return (
    <section id="report" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 72px", scrollMarginTop: 80 }}>
      <div style={{ padding: "32px 34px", borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "1 1 320px", minWidth: 0 }}>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: "#E6EDF7", color: "#24508F", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg {...ic} width={26} height={26}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13l2 2 4-4" /></svg>
            </span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.3 }}>تقرير الفحص</h2>
              <div style={{ color: "#4A5A56", fontSize: 15 }}>
                {r ? `رقم التقرير ${r.no} · تاريخ الفحص ${r.date} · الرقم التسلسلي للجهاز ${r.serial}` : "الفحص اتعمل بواسطة فني معتمد — التفاصيل الكاملة بتوصلك على واتساب لو طلبتها."}
              </div>
            </div>
          </div>
          <svg role="img" aria-label="رسم توضيحي لتقرير الفحص" viewBox="0 0 200 150" style={{ width: 150, height: "auto", flex: "none" }}><use href="#li-insp" /></svg>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {r ? (
            <>
              <Summary label="كفاءة التشغيل" value={r.efficiency} tone="ok" icon={<span style={{ ...iconBox, background: "#0D5C55", color: "#FFFFFF" }}><svg {...ic}><path d="M13 3L5 13h6l-1 8 8-10h-6z" /></svg></span>} />
              <Summary label="الحالة الظاهرية" value={r.appearance} tone="ok" icon={<span style={{ ...iconBox, background: "#0D5C55", color: "#FFFFFF" }}><svg {...ic}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>} />
              <Summary label="أجزاء اتغيرت" value={r.replacedParts} tone="plain" icon={<span style={{ ...iconBox, background: "#FFFFFF", border: "1px solid #C9D4CF", color: "#3C4C48", boxSizing: "border-box" }}><svg {...ic}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></svg></span>} />
            </>
          ) : null}
          <Summary label="عيوب مُعلنة" value={count} tone="warn" icon={<span style={{ ...iconBox, background: "#C46A12", color: "#FFFFFF", fontWeight: 700, fontSize: 20 }}>!</span>} />
        </div>

        {r && r.checklist.length ? (
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid #E5EBE8", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", background: "#F5F7F4", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <svg {...ic} width={18} height={18} stroke="#0D5C55"><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="M4 6l1 1 2-2" /><path d="M4 12l1 1 2-2" /><path d="M4 18l1 1 2-2" /></svg>
              قائمة الفحص — {typeLabel(d.type)}
            </div>
            {r.checklist.map((c, k) => {
              const text = c.note ? `${c.label} — ${c.note}` : c.label;
              return c.result === "pass" ? (
                <div key={k} className="li-row" style={{ padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E5EBE8" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <svg {...ic} width={15} height={15} strokeWidth={2.6}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span style={{ flex: 1 }}>{text}</span>
                  <span style={{ padding: "2px 10px", borderRadius: 999, background: "#E3F0ED", fontSize: 13, color: "#0D5C55", fontWeight: 600 }}>سليم</span>
                </div>
              ) : (
                <div key={k} style={{ padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E5EBE8", background: "#FDF6EC" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, background: "#F2A33A", color: "#12221F", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontWeight: 700 }}>!</span>
                  <span style={{ flex: 1 }}>{text}</span>
                  <span style={{ padding: "2px 10px", borderRadius: 999, background: "#FBEEDC", fontSize: 13, color: "#8A4209", fontWeight: 600 }}>ملاحظة</span>
                </div>
              );
            })}
          </div>
        ) : null}

        {defects.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", padding: 18, borderRadius: 18, background: "#FDF6EC", border: "1px solid #F0C88A" }}>
            <div style={{ width: 180, maxWidth: "100%", aspectRatio: "4 / 3", borderRadius: 14, overflow: "hidden", border: "2px solid #F0C88A", flex: "none", background: "#F3DFC2" }}>
              <svg role="img" aria-label="صورة العيب" viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}><use href="#li-defect" /></svg>
            </div>
            <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#6B3A10" }}>عيوب مُعلنة بوضوح</div>
              <div style={{ color: "#5A4A3C" }}>بنعرض أي عيب في الجهاز بصورته قبل ما تشتري. اللي في التقرير هو اللي هتستلمه.</div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
