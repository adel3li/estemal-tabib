import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: `${SITE.slogan}. كل جهاز بيتفحص، وفلوسك محفوظة لحد ما تستلم وتجرب، وكل جهاز عليه ضمان مكتوب.`,
};

export const viewport: Viewport = {
  themeColor: "#0D5C55",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
