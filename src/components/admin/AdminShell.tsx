"use client";

// Admin layout — dark sidebar ported from Admin-*.dc.html <aside class="ad-side">.
// ≥ 1024px: fixed sidebar as in the design. Phones & tablets: a slim top bar
// with the current section and a menu button that opens the sidebar as a drawer.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BellIcon,
  GridIcon,
  LockIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  ToothIcon,
  TruckIcon,
} from "@/components/icons";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/demo/store";

const NAV = [
  { href: routes.admin.devices, label: "الأجهزة المعروضة", Icon: GridIcon, match: (p: string) => p === routes.admin.devices || (p.startsWith("/admin/devices/") && p.endsWith("/edit")) },
  { href: routes.admin.newDevice, label: "إضافة جهاز", Icon: PlusIcon, match: (p: string) => p === routes.admin.newDevice },
  { href: routes.admin.submissions, label: "طلبات البيع الواردة", Icon: MailIcon, badge: "submissions" as const },
  { href: routes.admin.inspections, label: "الفحوصات", Icon: SearchIcon },
  { href: routes.admin.orders, label: "الطلبات والشحن", Icon: TruckIcon },
  { href: routes.admin.payments, label: "المدفوعات المحفوظة", Icon: LockIcon },
  { href: routes.admin.requests, label: "طلبات «اطلب جهاز»", Icon: BellIcon },
];

const isActive = (pathname: string, n: (typeof NAV)[number]) =>
  n.match ? n.match(pathname) : pathname === n.href || pathname.startsWith(n.href + "/");

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { state } = useDemo();
  const newSubs = state.submissions.filter((s) => s.status === "new").length;
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const current = NAV.find((n) => isActive(pathname, n));

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div dir="rtl" className="adm-root">
      {/* Phones & tablets: top bar */}
      <div className="adm-topbar">
        <button
          ref={menuBtn}
          type="button"
          className="adm-menu-btn"
          aria-expanded={open}
          aria-controls="adm-side"
          aria-label="افتح قائمة لوحة التحكم"
          onClick={() => setOpen(true)}
        >
          <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
          {newSubs > 0 ? <span className="adm-dot" aria-hidden /> : null}
        </button>
        <span className="adm-topbar-title">{current?.label ?? "لوحة التحكم"}</span>
        <Link href={routes.home} className="adm-topbar-logo" aria-label="استعمال طبيب — ارجع للموقع">
          <ToothIcon size={20} />
        </Link>
      </div>

      {open ? <div className="adm-scrim" aria-hidden onClick={() => setOpen(false)} /> : null}

      <aside id="adm-side" className={`ad-side adm-side${open ? " is-open" : ""}`} aria-label="قائمة لوحة التحكم">
        <div className="adm-side-head">
          <Link href={routes.home} style={{ color: "#FFFFFF", marginBottom: 4, flex: 1 }}>
            <span className="adm-logo-mark">
              <ToothIcon size={20} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
              <span style={{ fontWeight: 700 }}>استعمال طبيب</span>
              <span style={{ fontSize: 12, color: "#9FB8B1" }}>لوحة التحكم · ارجع للموقع</span>
            </span>
          </Link>
          <button type="button" className="adm-close" aria-label="اقفل القائمة" onClick={() => setOpen(false)}>
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div style={{ height: 1, background: "#2E5650", margin: "8px 0" }} />

        {NAV.map((n) => {
          const active = isActive(pathname, n);
          const { href, label, Icon, badge } = n;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              style={active ? { background: "#F2A33A", color: "#12221F", fontWeight: 700 } : undefined}
            >
              <Icon />
              {label}
              {badge === "submissions" && newSubs > 0 ? (
                <span
                  style={{
                    marginRight: "auto",
                    padding: "0 8px",
                    borderRadius: 999,
                    background: active ? "#12221F" : "#F2A33A",
                    color: active ? "#F2A33A" : "#12221F",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {newSubs}
                </span>
              ) : null}
            </Link>
          );
        })}

        <div className="adm-user">
          <span className="adm-avatar">أ</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>[اسم الموظف]</span>
            <span>أدمن</span>
          </span>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
