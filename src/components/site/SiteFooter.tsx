// Public site footer — ported from Main.dc.html <footer>.
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { ToothIcon, WhatsAppIcon } from "@/components/icons";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";

const link = { color: "#C3D3CE" } as const;
const col = { flex: "1 1 150px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 } as const;

export function SiteFooter() {
  return (
    <footer style={{ background: "#0F2A26", color: "#C3D3CE" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "52px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", justifyContent: "space-between" }}>
          <div style={{ flex: "2 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href={routes.home} style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF" }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#F2A33A",
                  color: "#12221F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ToothIcon />
              </span>
              <span style={{ fontSize: 22, fontWeight: 700 }}>استعمال طبيب</span>
            </Link>
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>من دكتور أسنان لدكتور أسنان… بثقة</span>
            <span style={{ fontSize: 15, maxWidth: 360 }}>
              منصة متخصصة في أجهزة الأسنان المستعملة: فحص فني لكل جهاز، وفلوسك محفوظة، وضمان مكتوب.
            </span>
          </div>

          <nav aria-label="المنصة" style={col}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>المنصة</span>
            <Link href={routes.devices} style={link}>كل الأجهزة</Link>
            <Link href={routes.request} style={link}>اطلب جهاز</Link>
            <Link href={routes.sell} style={link}>بيع جهازك</Link>
          </nav>

          <nav aria-label="عن استعمال طبيب" style={col}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>عن استعمال طبيب</span>
            <Link href={routes.about} style={link}>مين إحنا</Link>
            <Link href={routes.how} style={link}>إزاي بنشتغل</Link>
            <Link href={routes.warranty} style={link}>الضمان</Link>
            <Link href={routes.faq} style={link}>أسئلة شائعة</Link>
            <Link href={routes.terms} style={link}>شروط البيع والشراء</Link>
          </nav>

          <div style={{ ...col, flex: "1 1 200px" }}>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>تواصل معانا</span>
            <a
              href={waLink("أهلاً، عندي سؤال عن استعمال طبيب.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignSelf: "flex-start",
                minHeight: 44,
                padding: "0 18px",
                borderRadius: 12,
                background: "#F2A33A",
                color: "#12221F",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <WhatsAppIcon />
              كلمنا على واتساب
            </a>
            <span>واتساب: {BUSINESS.contact.whatsapp}</span>
            <span>{BUSINESS.contact.email}</span>
            <span>{BUSINESS.contact.social}</span>
          </div>
        </div>

        <div
          style={{
            paddingTop: 18,
            borderTop: "1px solid #2E5650",
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
