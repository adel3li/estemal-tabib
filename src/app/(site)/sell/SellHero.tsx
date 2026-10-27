const STEPS: { n: string; label: string; bg: string; fg: string }[] = [
  { n: "١", label: "بياناتك", bg: "#E3F0ED", fg: "#0D5C55" },
  { n: "٢", label: "بيانات الجهاز", bg: "#E6EDF7", fg: "#24508F" },
  { n: "٣", label: "الحالة والعيوب", bg: "#FBEEDC", fg: "#8A4209" },
  { n: "٤", label: "الصور والفيديو", bg: "#EAF5DD", fg: "#3F7A1F" },
  { n: "٥", label: "السعر", bg: "#E3F0ED", fg: "#0D5C55" },
  { n: "٦", label: "الإقرارات", bg: "#E6EDF7", fg: "#24508F" },
];

export function SellHero() {
  return (
    <div className="sl-hero" style={{ background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ alignSelf: "flex-start", padding: "4px 14px", borderRadius: 999, background: "#FBEEDC", color: "#8A4209", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12V4h8l10 10-8 8z" />
            <circle cx="7.5" cy="8.5" r="1.5" />
          </svg>
          بيع جهازك
        </span>
        <div>
          <h1 className="sl-h1">اعرض جهازك للبيع</h1>
          <p className="sl-lead">كل ما كانت البيانات أدق، كل ما الجهاز اتباع أسرع. بعد ما تبعت الطلب هنكلمك خلال 24 ساعة نحدد ميعاد الفحص.</p>
        </div>
        <nav aria-label="خطوات النموذج">
          <ol className="sl-steps">
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <a href={`#sl-s${i + 1}`} className="sl-step">
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: s.bg, color: s.fg, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{s.n}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="sl-hero-art" style={{ flex: "1 1 340px", minWidth: 0, maxWidth: 520, margin: "0 auto" }}>
        <svg role="img" aria-label="رسم توضيحي لكرسي أسنان مع تقرير فحص وسعر" viewBox="0 0 520 380" style={{ display: "block", width: "100%", height: "auto" }}>
          <use href="#sl-hero" />
        </svg>
      </div>
    </div>
  );
}
