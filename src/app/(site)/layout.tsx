import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BottomNav } from "@/components/site/BottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F3F6F7",
        color: "#122022",
        fontSize: 16,
        lineHeight: 1.7,
      }}
    >
      <SiteHeader />
      <div style={{ flex: "1 0 auto" }}>{children}</div>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
