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
import { ToothIcon } from "@/components/icons";
import { AccountMenu, AccountPanel, MenuBadge } from "./AccountMenu";
import { routes } from "@/lib/routes";

const TABS = [
  { href: routes.home, label: "الرئيسية" },
  { href: routes.devices, label: "اشتري جهاز" },
  { href: routes.sell, label: "بيع جهازك" },
  { href: routes.request, label: "اطلب جهاز" },
  { href: routes.how, label: "إزاي بنشتغل" },
  { href: routes.warranty, label: "الضمان" },
  { href: routes.reviews, label: "آراء العملاء" },
  { href: routes.faq, label: "أسئلة شائعة" },
  { href: routes.terms, label: "الشروط" },
  { href: routes.about, label: "مين إحنا" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
    <header className="site-header">
      <div className="site-header-row">
        <Link href={routes.home} aria-label="استعمال طبيب — الرئيسية" className="site-logo" onClick={close}>
          <span className="site-logo-mark">
            <ToothIcon />
          </span>
          <span className="site-logo-text">
            <span className="site-logo-name">استعمال طبيب</span>
            <span className="site-logo-sub">أجهزة أسنان مستعملة بفحص وضمان</span>
          </span>
        </Link>

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
            <Link key={n.href} href={n.href} onClick={close} aria-current={isActive(pathname, n.href) ? "page" : undefined}>
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
      </div>
      {open ? <div className="site-menu-scrim site-mobile" aria-hidden onClick={close} /> : null}
    </header>
    <nav ref={tabsRef} className="site-tabs" aria-label="صفحات الموقع">
      {TABS.map((n) => (
        <Link key={n.href} href={n.href} className="site-tab" aria-current={isActive(pathname, n.href) ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
    </>
  );
}
