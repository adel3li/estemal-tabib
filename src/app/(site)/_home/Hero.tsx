import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { HeroCarousel } from "./HeroCarousel";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;

export function Hero() {
  return (
    <>
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FFFFFF 0%, #F5F7F4 100%)", borderBottom: "1px solid #E5EBE8" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -160, left: -140, width: 560, height: 560, borderRadius: 999, background: "radial-gradient(circle, rgba(13, 92, 85, 0.10) 0%, rgba(13, 92, 85, 0) 70%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -200, right: -160, width: 520, height: 520, borderRadius: 999, background: "radial-gradient(circle, rgba(242, 163, 58, 0.10) 0%, rgba(242, 163, 58, 0) 70%)" }} />
      <section className="mn-hero" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ alignSelf: "flex-start", padding: "6px 14px 6px 16px", borderRadius: 999, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0D5C55", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: "#0D5C55" }} />
            منصة متخصصة 100% في أجهزة الأسنان المستعملة
          </span>
          <h1 className="mn-h1" style={{ margin: 0, lineHeight: 1.25, fontWeight: 700, letterSpacing: -0.5 }}>
            من دكتور أسنان لدكتور أسنان…{" "}
            <span style={{ color: "#0D5C55", position: "relative", whiteSpace: "nowrap" }}>
              بثقة
              <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position: "absolute", right: 0, left: 0, bottom: -6, width: "100%", height: 12 }}><path d="M3 8 Q60 1 117 7" stroke="#F2A33A" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
            </span>
          </h1>
          <p className="mn-hero-p" style={{ margin: 0, color: "#4A5A56", maxWidth: 560 }}>
            اشتري أو بيع أجهزة عيادتك المستعملة من غير قلق. كل جهاز بيتفحص بواسطة فني معتمد، وفلوسك بتفضل محفوظة معانا {DAYS} أيام بعد ما تستلم الجهاز وتجربه بنفسك.
          </p>
          <div className="mn-ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={routes.devices} className="mn-cta" style={{ padding: "14px 26px", borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, fontSize: 17, minHeight: 52, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10 }}>
              اشتري جهاز
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
            </Link>
            <Link href={routes.sell} className="mn-amber" style={{ padding: "14px 26px", borderRadius: 14, background: "#F2A33A", color: "#12221F", fontWeight: 700, fontSize: 17, minHeight: 52, boxSizing: "border-box", display: "flex", alignItems: "center" }}>بيع جهازك</Link>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: "6px 0 0", display: "flex", flexWrap: "wrap", gap: 10, fontSize: 15, fontWeight: 600 }}>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3DF" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#E6EDF7", color: "#24508F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              </span>
              فحص فني
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3DF" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </span>
              فلوسك محفوظة لمدة {DAYS} أيام
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3DF" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#FBEEDC", color: "#C46A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
                </svg>
              </span>
              صيانة لمدة {M1} – {M2} شهور
            </li>
          </ul>
        </div>
        <HeroCarousel />
      </section>
    </div>
    </>
  );
}
