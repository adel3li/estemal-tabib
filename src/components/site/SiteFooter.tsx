"use client";

// Public site footer — ported from Main.dc.html <footer>.
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { WhatsAppIcon } from "@/components/icons";
import { routes } from "@/lib/routes";
import { useSettings } from "@/lib/settings";

const link = { color: "#C3D3D3" } as const;
const col = { flex: "1 1 150px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 } as const;

export function SiteFooter() {
  const { wa, whatsapp, email, social } = useSettings();
  return (
    <footer className="site-footer" style={{ background: "#14243A", color: "#C3D3D3" }}>
      {/* Brand pattern strip (brand book): decoration only, never behind text. */}
      <div aria-hidden="true" className="ft-pattern" />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "52px 20px calc(24px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <div className="ft-row" style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", justifyContent: "space-between" }}>
          <div style={{ flex: "2 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href={routes.home} style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.svg" alt="استعمال طبيب" width={130} height={64} style={{ height: 64, width: "auto", display: "block" }} />
            </Link>
            {/* Brand line from the brand book, «ثقة» in orange. */}
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 20 }}>
              مكان <span style={{ color: "#F7941D" }}>ثقة</span> لكل طبيب
            </span>
            <span style={{ fontSize: 15, maxWidth: 360 }}>
              منصة متخصصة في أجهزة الأسنان المستعملة: فحص فني لكل جهاز، وفلوسك محفوظة، وضمان مكتوب.
            </span>
          </div>

          <nav aria-label="المنصة" className="ft-links" style={col}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>المنصة</span>
            <Link href={routes.devices} style={link}>كل الأجهزة</Link>
            <Link href={routes.request} style={link}>اطلب جهاز</Link>
            <Link href={routes.sell} style={link}>بيع جهازك</Link>
          </nav>

          <nav aria-label="عن استعمال طبيب" className="ft-links" style={col}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>عن استعمال طبيب</span>
            <Link href={routes.about} style={link}>مين إحنا</Link>
            <Link href={routes.how} style={link}>إزاي بنشتغل</Link>
            <Link href={routes.warranty} style={link}>الضمان</Link>
            <Link href={routes.faq} style={link}>أسئلة شائعة</Link>
            <Link href={routes.reviews} style={link}>آراء العملاء</Link>
            <Link href={routes.terms} style={link}>شروط البيع والشراء</Link>
          </nav>

          <div style={{ ...col, flex: "1 1 200px" }}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>تواصل معانا</span>
            <a
              href={wa("أهلاً، عندي سؤال عن استعمال طبيب.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignSelf: "flex-start",
                minHeight: 44,
                padding: "0 18px",
                borderRadius: 12,
                background: "#F7941D",
                color: "#122022",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <WhatsAppIcon />
              كلمنا على واتساب
            </a>
            <span>واتساب: <span dir="ltr">{whatsapp}</span></span>
            <span>{email}</span>
            {social.length ? (
              <span style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {social.map((x) => (
                  <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                    {x.label}
                  </a>
                ))}
              </span>
            ) : (
              <span>{BUSINESS.contact.social}</span>
            )}
          </div>
        </div>

        <div
          style={{
            paddingTop: 18,
            borderTop: "1px solid #2E4F56",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 14,
          }}
        >
          <span>© 2026 استعمال طبيب. كل الحقوق محفوظة.</span>
          <Link href={routes.terms} style={link}>الشروط والأحكام</Link>
        </div>
      </div>
    </footer>
  );
}
