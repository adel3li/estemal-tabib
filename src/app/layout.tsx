import type { Metadata, Viewport } from "next";
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
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: { default: "استعمال طبيب", template: "%s — استعمال طبيب" },
  description:
    "منصة متخصصة في أجهزة الأسنان المستعملة: فحص في كل جهاز، وفلوسك محفوظة، وضمان مكتوب.",
  applicationName: "استعمال طبيب",
  appleWebApp: { capable: true, title: "استعمال طبيب", statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
  manifest: "/manifest.webmanifest",
};

// Pinch-zoom stays enabled (accessibility); viewport-fit=cover lets us use the
// iPhone safe areas (notch / home bar) via env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D5C55",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <DemoProvider>
            {children}
            <DemoBar />
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
