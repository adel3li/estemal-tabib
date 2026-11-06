"use client";

// Public site header.
// Row 1 (sticky): logo + buttons. Desktop (≥ 1024px) shows «تابع طلبك»,
// «بيع جهازك», «اشتري جهاز»; phones & tablets show «بيع جهازك» + a menu button.
// Row 2 (scrolls with the page): a tab per page, on every screen size, so each
// part of the site is its own page instead of one long home page.
// For the clickable demo «تابع طلبك» opens the demo order tracker.
// Account: «دخول» or the avatar menu sit in row 1 from 600px; below that they
// live at the top of the menu panel (the row has no room at 360–599px).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountMenu, AccountPanel, MenuBadge, SignOutRow } from "./AccountMenu";
import { routes } from "@/lib/routes";
import { BUSINESS, MAINT_LIST } from "@/config/business";
import { useSettings } from "@/lib/settings";


// Client asked for a shorter menu (Nov 2026): «إزاي بنشتغل»، «آراء العملاء»،
// «أسئلة شائعة» and «مين إحنا» are only in the footer now. Buy/sell stand out.
const TABS: { href: string; label: string; tone?: "buy" | "sell" }[] = [
  { href: routes.home, label: "الرئيسية" },
  { href: routes.devices, label: "اشتري جهاز", tone: "buy" },
  { href: routes.sell, label: "بيع جهازك", tone: "sell" },
  { href: routes.request, label: "اطلب جهاز" },
  { href: routes.warranty, label: "الضمان" },
  { href: routes.terms, label: "الشروط" },
];

const toneClass = (tone?: "buy" | "sell") => (tone ? ` site-tone-${tone}` : "");

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { whatsapp } = useSettings();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tabsRef = useRef<HTMLElement>(null);

  // Phones: bring the current page's tab into view in the scrolling tab row.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!row || !tab) return;
    const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    row.scrollTo({ left, behavior: "auto" });
  }, [pathname]);

  // Close on navigation (also covers same-page hash links via click handler below).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI state on route change
  useEffect(() => setOpen(false), [pathname]);

  // Esc closes; focus moves into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
    {/* v2: trust strip above the header (desktop only) */}
    <div className="site-util site-desktop">
      <div className="site-util-row">
        <ul>
          <li><b>فحص فني</b> لكل جهاز قبل ما يوصلك</li>
          <li>فلوسك محفوظة <b>{BUSINESS.trialDays}</b> أيام بعد الاستلام</li>
          <li>صيانة مجانية <b>{MAINT_LIST}</b></li>
        </ul>
        <span>واتساب <bdi dir="ltr">{whatsapp}</bdi></span>
      </div>
    </div>
    <header className="site-header">
      <div className="site-header-row">
        <Link href={routes.home} aria-label="استعمال طبيب — الرئيسية" className="site-logo" onClick={close}>
          {/* Client logo (exploration — cut from a screenshot; swap for the vector file) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="استعمال طبيب" style={{ height: 52, width: "auto", display: "block" }} />
        </Link>

        <form action={routes.devices} method="get" role="search" className="site-search site-desktop">
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input type="search" name="q" placeholder="ابحث بنوع الجهاز، الماركة أو الموديل…" aria-label="ابحث عن جهاز" enterKeyHint="search" />
          <button type="submit">بحث</button>
        </form>

        <div className="site-actions">
          <Link href={routes.demoOrder} className="site-btn site-ghost site-desktop">
            تابع طلبك
          </Link>
          <Link href={routes.sell} className="site-btn site-amber" onClick={close}>
            بيع جهازك
          </Link>
          <Link href={routes.devices} className="site-btn site-cta site-desktop">
            اشتري جهاز
          </Link>
          <AccountMenu />
          <button
            ref={buttonRef}
            type="button"
            className="site-menu-btn site-mobile"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "اقفل القائمة" : "افتح القائمة"}
            onClick={() => setOpen((v) => !v)}
            style={{ position: "relative" }}
          >
            <MenuBadge />
            <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id="site-menu" ref={panelRef} className="site-menu site-mobile" hidden={!open}>
        <AccountPanel onNavigate={close} />
        <nav aria-label="القائمة الرئيسية">
          {TABS.map((n) => (
            <Link key={n.href} href={n.href} onClick={close} className={toneClass(n.tone).trim() || undefined} aria-current={isActive(pathname, n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="site-menu-actions">
          <Link href={routes.devices} className="site-btn site-cta" onClick={close}>
            اشتري جهاز
          </Link>
          <Link href={routes.demoOrder} className="site-btn site-ghost" onClick={close}>
            تابع طلبك
          </Link>
        </div>
        <SignOutRow onNavigate={close} />
      </div>
      {open ? <div className="site-menu-scrim site-mobile" aria-hidden onClick={close} /> : null}
    </header>
    <nav ref={tabsRef} className="site-tabs" aria-label="صفحات الموقع">
      {TABS.map((n) => (
        <Link key={n.href} href={n.href} className={`site-tab${toneClass(n.tone)}`} aria-current={isActive(pathname, n.href) ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
    </>
  );
}
