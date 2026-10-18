"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { btn } from "./ui";

/** Phone menu: a button in the header that drops down the nav links and CTAs. */
export function MobileMenu({ nav }: { nav: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  // Links close the menu on click; Escape closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "اقفل القائمة" : "افتح القائمة"}
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-field bg-surface text-ink"
      >
        <Icon name={open ? "x" : "menu"} size={22} />
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full z-40 border-b border-line bg-surface shadow-[0_18px_30px_rgba(18,34,31,0.12)]">
          <nav aria-label="القائمة الرئيسية" className="flex flex-col px-4 py-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line-soft text-[17px] font-medium text-ink last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-2.5 px-4 pt-1 pb-4">
            <Link href="/orders/1024" onClick={() => setOpen(false)} className={btn.outline}>
              تابع طلبك
            </Link>
            <Link href="/devices" onClick={() => setOpen(false)} className={btn.primary}>
              اشتري جهاز
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
