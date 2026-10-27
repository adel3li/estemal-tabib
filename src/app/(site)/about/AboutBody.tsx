import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;

export function AboutBody() {
  return (
    <>
    <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FFFFFF 0%, #F5F7F4 100%)", borderBottom: "1px solid #E5EBE8" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -180, left: -140, width: 540, height: 540, borderRadius: 999, background: "radial-gradient(circle, rgba(13, 92, 85, 0.10) 0%, rgba(13, 92, 85, 0) 70%)" }} />
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "20px 20px 64px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 14, color: "#4A5A56", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}><Link href={routes.home}>الرئيسية</Link><span aria-hidden="true">›</span><span>مين إحنا</span></div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
          <div style={{ flex: "1 1 440px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ alignSelf: "flex-start", padding: "6px 14px 6px 16px", borderRadius: 999, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0D5C55", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: "#0D5C55" }} />
              مين إحنا
            </span>
            <h1 style={{ margin: 0, fontSize: "clamp(32px, 4.5vw, 50px)", lineHeight: 1.3 }}>بنخلّي شراء وبيع أجهزة الأسنان المستعملة <span style={{ color: "#0D5C55" }}>آمن وواضح</span></h1>
            <p style={{ margin: 0, fontSize: 19, color: "#4A5A56", maxWidth: 760 }}>
              استعمال طبيب منصة متخصصة 100% في أجهزة وأدوات طب الأسنان المستعملة. بنقف في النص بين البايع والمشتري: بنفحص الجهاز، وبنحفظ الفلوس، وبنوصّل الجهاز بضمان.
            </p>
          </div>
          <div style={{ flex: "1 1 380px", minWidth: 0, maxWidth: 520, borderRadius: 24, overflow: "hidden", border: "1px solid #DCE3DF", boxShadow: "0 18px 40px rgba(18, 34, 31, 0.08)", background: "#E7EDEA" }}>
            <svg role="img" aria-label="رسم توضيحي: الجهاز بيتنقل من البايع للمشتري عن طريق استعمال طبيب، اللي بيفحصه ويحفظ الفلوس" viewBox="0 0 520 320" style={{ display: "block", width: "100%", height: "auto" }}><use href="#ab-bridge" /></svg>
          </div>
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 20px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      <div style={{ padding: 32, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ width: 52, height: 52, borderRadius: 16, background: "#FBEEDC", color: "#C46A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <h2 style={{ margin: 0, fontSize: 24 }}>ليه بدأنا</h2>
        <p style={{ margin: 0, color: "#3C4C48" }}>
          من الطلبة وحديثي التخرج، لحد الدكاترة اللي بيجهّزوا عيادة جديدة أو بيطوّروا عيادتهم، الكل بيخاف يشتري جهاز مستعمل: مفيش ضمان، وممكن يكون فيه عيوب مستخبية، وصعب تعرف حالته الفنية.
        </p>
        <p style={{ margin: 0, color: "#3C4C48" }}>واللي عايز يبيع، طالب أو دكتور، بيتعب من الوسطاء والإعلانات اللي مش جادة وضياع الوقت.</p>
      </div>
      <div style={{ position: "relative", overflow: "hidden", padding: 32, borderRadius: 24, background: "#0F2A26", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: 12 }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -120, left: -100, width: 320, height: 320, borderRadius: 999, background: "radial-gradient(circle, rgba(242, 163, 58, 0.14) 0%, rgba(242, 163, 58, 0) 70%)" }} />
        <span style={{ position: "relative", width: 52, height: 52, borderRadius: 16, background: "rgba(242, 163, 58, 0.16)", color: "#F2A33A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
        </span>
        <h2 style={{ position: "relative", margin: 0, fontSize: 24 }}>إحنا بنعمل إيه</h2>
        <p style={{ position: "relative", margin: 0, color: "#C3D3CE" }}>
          بنلعب دور الوسيط اللي بيفحص ويضمن. كل جهاز بيتفحص بواسطة فني معتمد، والفلوس بتفضل محفوظة معانا لحد ما المشتري يستلم ويجرّب، وبعدها بتتحول للبايع.
        </p>
        <p style={{ position: "relative", margin: 0, color: "#C3D3CE" }}>كده البايع بياخد حقه، والمشتري بياخد جهاز بحالة كويسة وبسعر عادل.</p>
      </div>
    </section>
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 20px 0", display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ margin: 0, fontSize: 30 }}>اللي بنلتزم بيه</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        <div className="ab-value" style={{ padding: 24, borderRadius: 22, background: "#E3F0ED", border: "1px solid #9CCBC2", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /></svg>
          </span>
          <h3 style={{ margin: 0, fontSize: 19, color: "#0B4A44" }}>الشفافية</h3>
          <p style={{ margin: 0, color: "#2E4A45" }}>صور حقيقية للجهاز، وتقرير فحص، وكل عيب مكتوب بصورته.</p>
        </div>
        <div className="ab-value" style={{ padding: 24, borderRadius: 22, background: "#E6EDF7", border: "1px solid #A9BFE0", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: "#24508F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
          </span>
          <h3 style={{ margin: 0, fontSize: 19, color: "#1B3F73" }}>الفحص قبل البيع</h3>
          <p style={{ margin: 0, color: "#2D4566" }}>فني معتمد بيفحص الجهاز قبل ما يتعرض، أو عند البايع قبل الشحن.</p>
        </div>
        <div className="ab-value" style={{ padding: 24, borderRadius: 22, background: "#FBEEDC", border: "1px solid #F0C88A", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: "#C46A12", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          </span>
          <h3 style={{ margin: 0, fontSize: 19, color: "#6B3A10" }}>فلوسك محفوظة</h3>
          <p style={{ margin: 0, color: "#5E3A17" }}>الفلوس بتفضل معانا {DAYS} أيام بعد الاستلام قبل ما تتحول للبايع.</p>
        </div>
        <div className="ab-value" style={{ padding: 24, borderRadius: 22, background: "#EAF5DD", border: "1px solid #A9D17F", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: "#3F7A1F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
            </svg>
          </span>
          <h3 style={{ margin: 0, fontSize: 19, color: "#2F5A15" }}>ضمان وصيانة</h3>
          <p style={{ margin: 0, color: "#36521F" }}>ضمان تشغيل واستبدال، وصيانة من {M1} لـ {M2} شهور حسب الجهاز.</p>
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 20px 80px" }}>
      <div style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", overflow: "hidden", display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ flex: "1 1 380px", minWidth: 0, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28 }}>جاهز تبدأ؟</h2>
            <p style={{ margin: "4px 0 0", color: "#4A5A56", fontSize: 17 }}>دوّر على الجهاز اللي محتاجه، أو اعرض جهازك للبيع في دقايق.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href={routes.devices} className="ab-cta" style={{ minHeight: 52, padding: "0 24px", borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              اشتري جهاز
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
            </Link>
            <Link href={routes.sell} className="ab-amber" style={{ minHeight: 52, padding: "0 24px", borderRadius: 14, background: "#F2A33A", color: "#12221F", fontWeight: 700, display: "flex", alignItems: "center" }}>بيع جهازك</Link>
          </div>
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 0, minHeight: 220, background: "#E7EDEA" }}>
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%", minHeight: 220 }}><use href="#ab-unit" /></svg>
        </div>
      </div>
    </section>
    </>
  );
}
