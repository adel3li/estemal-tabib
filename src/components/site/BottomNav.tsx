"use client";

// Fixed bottom navigation on phones & tablets (< 1024px) — client request,
// Nov 2026. Hidden on device pages, which have their own bottom «اطلب الجهاز» bar.
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { routes } from "@/lib/routes";

const Icon = ({ children }: { children: ReactNode }) => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const isOn = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export function BottomNav() {
  const pathname = usePathname();
  const { ready, userId } = useAuth();
  if (/^\/devices\/[^/]+/.test(pathname)) return null;

  const accountHref = !ready || userId ? routes.account : loginHref(pathname.startsWith("/login") ? routes.account : pathname);
  const items: { href: string; label: string; match: string; tone?: "sell"; icon: ReactNode }[] = [
    { href: routes.home, match: routes.home, label: "الرئيسية", icon: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></> },
    { href: routes.devices, match: routes.devices, label: "اشتري جهاز", icon: <><path d="M3 4h2l2.4 11h11L21 7H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></> },
    { href: routes.sell, match: routes.sell, label: "بيع جهازك", tone: "sell", icon: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></> },
    { href: routes.request, match: routes.request, label: "اطلب جهاز", icon: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /><path d="M11 8v6M8 11h6" /></> },
    { href: accountHref, match: routes.account, label: ready && !userId ? "دخول" : "حسابي", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></> },
  ];

  return (
    <nav className="site-bnav" aria-label="تنقّل سريع">
      {items.map((it) => (
        <Link key={it.label} href={it.href} className={it.tone ? "site-bnav-item site-bnav-sell" : "site-bnav-item"} aria-current={isOn(pathname, it.match) ? "page" : undefined}>
          <Icon>{it.icon}</Icon>
          <span>{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
