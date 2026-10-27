import { svgProps } from "./helpers";

const ic = { "aria-hidden": true, width: 22, height: 22, viewBox: "0 0 24 24", ...svgProps, strokeWidth: 1.8 } as const;

const STEPS = [
  { n: "١", text: "تدفع الفلوس أو جزء منها، والفلوس بتتحفظ عندنا", bg: "#E3F0ED", bd: "#9CCBC2", ib: "#0D5C55", num: "#0D5C55", fg: "#0B4A44", icon: <svg {...ic}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg> },
  { n: "٢", text: "نفحص الجهاز", bg: "#E6EDF7", bd: "#A9BFE0", ib: "#24508F", num: "#24508F", fg: "#1B3F73", icon: <svg {...ic}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg> },
  { n: "٣", text: "تقرير الفحص يوصلك وتأكّد على الطلب", bg: "#FBEEDC", bd: "#F0C88A", ib: "#C46A12", num: "#8A4209", fg: "#6B3A10", icon: <svg {...ic}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13l2 2 4-4" /></svg> },
  { n: "٤", text: "نشحن لك لحد بابك وتعاين بنفسك", bg: "#EAF5DD", bd: "#A9D17F", ib: "#3F7A1F", num: "#3F7A1F", fg: "#2F5A15", icon: <svg {...ic}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg> },
];

export function Steps() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 72px" }}>
      <div style={{ padding: "32px 34px", borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>إيه اللي هيحصل بعد ما تطلب</h2>
          <span style={{ color: "#4A5A56" }}>4 خطوات، وفي كل خطوة بنبلغك على واتساب.</span>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {STEPS.map((s) => (
            <li key={s.n} style={{ padding: 20, borderRadius: 18, background: s.bg, border: `1px solid ${s.bd}`, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, background: s.ib, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: s.num, opacity: 0.35 }}>{s.n}</span>
              </div>
              <div style={{ fontWeight: 600, color: s.fg }}>{s.text}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
