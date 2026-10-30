import { BUSINESS } from "@/config/business";

const DAYS = BUSINESS.trialDays;

export function HowItWorks() {
  return (
    <>
    <section id="how" style={{ background: "#FFFFFF", borderBottom: "1px solid #E5EBE8" }}>
      <div className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 className="mn-h2" style={{ margin: 0, fontWeight: 700 }}>إزاي بنشتغل؟</h1>
          <p style={{ margin: 0, color: "#4A5A56" }} className="mn-lead">أربع خطوات، وكل خطوة واضحة قدامك.</p>
        </div>
        <ol className="mn-steps" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 18 }}>
          <li style={{ padding: 24, borderRadius: 22, background: "#E3F0ED", border: "1px solid #9CCBC2", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 34, fontWeight: 700, color: "#0D5C55", opacity: 0.3 }}>١</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, color: "#0B4A44" }}>البايع بيعرض جهازه</h3>
            <p style={{ margin: 0, color: "#2E4A45" }}>بيانات الجهاز، وصوره وهو شغال.</p>
          </li>
          <li style={{ padding: 24, borderRadius: 22, background: "#E6EDF7", border: "1px solid #A9BFE0", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "#24508F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 34, fontWeight: 700, color: "#24508F", opacity: 0.3 }}>٢</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, color: "#1B3F73" }}>بنفحص الجهاز</h3>
            <p style={{ margin: 0, color: "#2D4566" }}>أجهزة بتتفحص قبل ما تتعرض، والباقي بنفحصه أول ما تطلبه وقبل الشحن.</p>
          </li>
          <li style={{ padding: 24, borderRadius: 22, background: "#FBEEDC", border: "1px solid #F0C88A", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "#C46A12", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 34, fontWeight: 700, color: "#8A4209", opacity: 0.3 }}>٣</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, color: "#6B3A10" }}>تدفع وفلوسك محفوظة</h3>
            <p style={{ margin: 0, color: "#5E3A17" }}>تدفع الفلوس أو جزء منها، وبتفضل عندنا {DAYS} أيام بعد الاستلام قبل ما تتحول للبايع.</p>
          </li>
          <li style={{ padding: 24, borderRadius: 22, background: "#EAF5DD", border: "1px solid #A9D17F", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "#3F7A1F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h4l3 3v3h-7" />
                  <circle cx="7" cy="17.5" r="1.8" />
                  <circle cx="17" cy="17.5" r="1.8" />
                </svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 34, fontWeight: 700, color: "#3F7A1F", opacity: 0.3 }}>٤</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, color: "#2F5A15" }}>نوصّل لحد بابك بضمان</h3>
            <p style={{ margin: 0, color: "#36521F" }}>شحن آمن لحد بابك وتعاين بنفسك، مع ضمان تشغيل واستبدال وصيانة.</p>
          </li>
        </ol>
      </div>
    </section>
    {/* TWO INSPECTION TYPES */}
    <section className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2 className="mn-h2" style={{ margin: 0, fontWeight: 700 }}>نوعين من الفحص… وانت عارف كل جهاز فين</h2>
        <p style={{ margin: 0, color: "#4A5A56" }} className="mn-lead">على كل جهاز علامة بتقولك اتفحص ولا لسه هيتفحص قبل ما يتشحن لك.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 20 }}>
        <div style={{ borderRadius: 24, background: "#FFFFFF", border: "2px solid #0D5C55", overflow: "hidden", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column" }}>
          <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", aspectRatio: "3 / 1" }}><use href="#mn-report" /></svg>
          <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ alignSelf: "flex-start", padding: "6px 14px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              تم الفحص
            </span>
            <h3 style={{ margin: 0, fontSize: 22 }}>الجهاز اتفحص قبل ما يتعرض</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, color: "#3C4C48", display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                تقرير الفحص الكامل قدامك قبل ما تدفع
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                الصور من فريق الفحص
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                شحن أسرع لأن الفحص خلص
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderRadius: 24, background: "#FFFFFF", border: "2px solid #24508F", overflow: "hidden", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column" }}>
          <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", aspectRatio: "3 / 1" }}><use href="#mn-visit" /></svg>
          <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ alignSelf: "flex-start", padding: "6px 14px", borderRadius: 999, background: "#E6EDF7", color: "#24508F", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
              يُفحص عند الطلب
            </span>
            <h3 style={{ margin: 0, fontSize: 22 }}>بنفحصه بعد طلبك وقبل الشحن</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, color: "#3C4C48", display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#24508F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                تقرير الفحص بيوصلك قبل ما الجهاز يتشحن
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#24508F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                لو الجهاز طلع مش مطابق، فلوسك بترجعلك كاملة
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#24508F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                لحد الفحص، الصور من البايع
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
