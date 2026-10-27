const STEPS = [
  { n: "١", label: "الجهاز اللي محتاجه", bg: "#E3F0ED", fg: "#0D5C55" },
  { n: "٢", label: "الميزانية والتوقيت", bg: "#FBEEDC", fg: "#8A4209" },
  { n: "٣", label: "بياناتك", bg: "#E6EDF7", fg: "#24508F" },
];

export function RequestHero() {
  return (
    <div style={{ padding: 30, borderRadius: 28, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 26 }}>
      <div style={{ flex: "999 1 380px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 38, lineHeight: 1.3 }}>اطلب جهاز</h1>
          <p style={{ margin: "8px 0 0", color: "#4A5A56", fontSize: 17 }}>قولنا محتاج إيه وميزانيتك كام، وهنبلغك على واتساب أول ما يتعرض جهاز مناسب. الطلب مجاني ومش بيلزمك بالشراء.</p>
        </div>
        <nav aria-label="خطوات النموذج">
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8 }}>
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <a href={`#rq-s${i + 1}`} className="rq-step">
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: s.bg, color: s.fg, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{s.n}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div style={{ flex: "1 1 300px", minWidth: 0, maxWidth: 440, margin: "0 auto" }}>
        <svg role="img" aria-label="رسم توضيحي لموبايل بيوصله تنبيه بجهاز مناسب" viewBox="0 0 520 380" style={{ display: "block", width: "100%", height: "auto" }}>
          <use href="#rq-hero" />
        </svg>
      </div>
    </div>
  );
}
