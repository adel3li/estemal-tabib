import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { DrawnUnderline } from "./DrawnUnderline";
import { HeroCarousel } from "./HeroCarousel";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;

export function Hero() {
  return (
    <>
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FFFFFF 0%, #F3F6F7 100%)", borderBottom: "1px solid #E5EBEA" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -160, left: -140, width: 560, height: 560, borderRadius: 999, background: "radial-gradient(circle, rgba(10,126,153, 0.10) 0%, rgba(10,126,153, 0) 70%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -200, right: -160, width: 520, height: 520, borderRadius: 999, background: "radial-gradient(circle, rgba(245,146,28, 0.10) 0%, rgba(245,146,28, 0) 70%)" }} />
      <section className="mn-hero" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ alignSelf: "flex-start", padding: "6px 14px 6px 16px", borderRadius: 999, background: "#E2F4F8", border: "1px solid #9ED8E6", color: "#0A7E99", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: "#0A7E99" }} />
            منصة متخصصة 100% في أجهزة الأسنان المستعملة
          </span>
          <h1 className="mn-h1" style={{ margin: 0, lineHeight: 1.25, fontWeight: 700, letterSpacing: -0.5 }}>
            من طبيب أسنان
            <br />
            لطبيب أسنان…{" "}
            <span style={{ color: "#0A7E99", position: "relative", whiteSpace: "nowrap" }}>
              بثقة
              <DrawnUnderline />
            </span>
          </h1>
          <p className="mn-hero-p" style={{ margin: 0, color: "#4A595A", maxWidth: 560 }}>
            اشتري أو بيع أجهزة عيادتك المستعملة من غير قلق. كل جهاز بيتفحص بواسطة فني معتمد، وفلوسك بتفضل محفوظة معانا {DAYS} أيام بعد ما تستلم الجهاز وتجربه بنفسك.
          </p>
          <div className="mn-ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={routes.devices} className="mn-cta" style={{ padding: "14px 26px", borderRadius: 14, background: "#0A7E99", color: "#FFFFFF", fontWeight: 700, fontSize: 17, minHeight: 52, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10 }}>
              اشتري جهاز
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
            </Link>
            <Link href={routes.sell} className="mn-amber" style={{ padding: "14px 26px", borderRadius: 14, background: "#F5921C", color: "#122022", fontWeight: 700, fontSize: 17, minHeight: 52, boxSizing: "border-box", display: "flex", alignItems: "center" }}>بيع جهازك</Link>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: "6px 0 0", display: "flex", flexWrap: "wrap", gap: 10, fontSize: 15, fontWeight: 600 }}>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3E1" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#E6EDF7", color: "#24508F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              </span>
              فحص فني
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3E1" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#E2F4F8", color: "#0A7E99", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </span>
              فلوسك محفوظة لمدة {DAYS} أيام
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3E1" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#FEEEDB", color: "#D0700A", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
