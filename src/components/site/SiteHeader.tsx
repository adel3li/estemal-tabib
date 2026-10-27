"use client";

// Public site header — ported from Main.dc.html <header>.
// Desktop (≥ 1024px): logo · nav · 3 buttons, as in the design.
// Phones & tablets: logo + «بيع جهازك» + a menu button that opens a panel with
// the nav links and the other buttons (the design only shows desktop).
// For the clickable demo «تابع طلبك» opens the demo order tracker.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ToothIcon } from "@/components/icons";
import { routes } from "@/lib/routes";

const NAV = [
  { href: routes.devices, label: "كل الأجهزة" },
  { href: routes.how, label: "إزاي بنشتغل" },
  { href: routes.warranty, label: "الضمان" },
  { href: routes.faq, label: "أسئلة شائعة" },
  { href: routes.about, label: "مين إحنا" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

        <nav className="site-nav site-desktop" aria-label="القائمة الرئيسية">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

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
          <button
            ref={buttonRef}
            type="button"
            className="site-menu-btn site-mobile"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "اقفل القائمة" : "افتح القائمة"}
            onClick={() => setOpen((v) => !v)}
          >
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
        <nav aria-label="القائمة الرئيسية">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={close}>
              {n.label}
            </Link>
          ))}
          <Link href={routes.request} onClick={close}>
            اطلب جهاز
          </Link>
          <Link href={routes.terms} onClick={close}>
            شروط البيع والشراء
          </Link>
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
  );
}
