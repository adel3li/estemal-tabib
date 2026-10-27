import type { Metadata } from "next";
// Self-hosted IBM Plex Sans Arabic (see DECISIONS.md #1). Each CSS file
// declares Arabic + Latin subsets with unicode-range, so browsers only
// download what a page needs.
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";
import { DemoProvider } from "@/lib/demo/store";
import { DemoBar } from "@/components/demo/DemoBar";

export const metadata: Metadata = {
  title: { default: "استعمال طبيب", template: "%s — استعمال طبيب" },
  description:
    "منصة متخصصة في أجهزة الأسنان المستعملة: فحص في كل جهاز، وفلوسك محفوظة، وضمان مكتوب.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DemoProvider>
          {children}
          <DemoBar />
        </DemoProvider>
      </body>
    </html>
  );
}
