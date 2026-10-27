import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F5F7F4",
        color: "#12221F",
        fontSize: 16,
        lineHeight: 1.7,
      }}
    >
      <SiteHeader />
      <div style={{ flex: "1 0 auto" }}>{children}</div>
      <SiteFooter />
    </div>
  );
}
