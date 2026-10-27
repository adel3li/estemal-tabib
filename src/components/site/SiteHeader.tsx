// Public site header — ported from Main.dc.html <header>.
// Same on every public page (PHASE1_PROMPT.md §2.1 #1). For the clickable demo
// «تابع طلبك» opens the demo order tracker (Phase 2 page) so it can be tested.
import Link from "next/link";
import { ToothIcon } from "@/components/icons";
import { routes } from "@/lib/routes";

const btn = {
  padding: "10px 16px",
  borderRadius: 12,
  fontWeight: 600,
  minHeight: 44,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
} as const;

export function SiteHeader() {
  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        borderBottom: "1px solid #DCE3DF",
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href={routes.home}
          aria-label="استعمال طبيب — الرئيسية"
          style={{ display: "flex", alignItems: "center", gap: 10, color: "#12221F" }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#0D5C55",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ToothIcon />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>استعمال طبيب</span>
            <span style={{ fontSize: 12, color: "#4A5A56" }}>أجهزة أسنان مستعملة بفحص وضمان</span>
          </span>
        </Link>

        <nav
          className="site-nav"
          aria-label="القائمة الرئيسية"
          style={{ display: "flex", flexWrap: "wrap", gap: 22, fontSize: 15 }}
        >
          <Link href={routes.devices}>كل الأجهزة</Link>
          <Link href={routes.how}>إزاي بنشتغل</Link>
          <Link href={routes.warranty}>الضمان</Link>
          <Link href={routes.faq}>أسئلة شائعة</Link>
          <Link href={routes.about}>مين إحنا</Link>
        </nav>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link
            href={routes.demoOrder}
            className="site-ghost"
            style={{ ...btn, border: "1px solid #C9D4CF", color: "#12221F" }}
          >
            تابع طلبك
          </Link>
          <Link
            href={routes.sell}
            className="site-amber"
            style={{ ...btn, padding: "10px 18px", background: "#F2A33A", color: "#12221F", fontWeight: 700 }}
          >
            بيع جهازك
          </Link>
          <Link
            href={routes.devices}
            className="site-cta"
            style={{ ...btn, padding: "10px 18px", background: "#0D5C55", color: "#FFFFFF" }}
          >
            اشتري جهاز
          </Link>
        </div>
      </div>
    </header>
  );
}
