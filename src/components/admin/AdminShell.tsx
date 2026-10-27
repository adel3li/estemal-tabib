"use client";

// Admin layout — dark sidebar ported from Admin-*.dc.html <aside class="ad-side">.
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
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

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { state } = useDemo();
  const newSubs = state.submissions.filter((s) => s.status === "new").length;

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        flexWrap: "wrap",
        minHeight: "100vh",
        background: "#EEF2F0",
        color: "#12221F",
        fontSize: 16,
        lineHeight: 1.6,
      }}
    >
      <aside
        className="ad-side"
        aria-label="قائمة لوحة التحكم"
        style={{
          flex: "0 0 250px",
          background: "#0F2A26",
          color: "#C3D3CE",
          padding: "22px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          minHeight: "100vh",
        }}
      >
        <Link href={routes.home} style={{ color: "#FFFFFF", marginBottom: 4 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#F2A33A",
              color: "#12221F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <ToothIcon size={20} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            <span style={{ fontWeight: 700 }}>استعمال طبيب</span>
            <span style={{ fontSize: 12, color: "#9FB8B1" }}>لوحة التحكم · ارجع للموقع</span>
          </span>
        </Link>
        <div style={{ height: 1, background: "#2E5650", margin: "8px 0" }} />

        {NAV.map(({ href, label, Icon, badge, match }) => {
          const active = match ? match(pathname) : pathname === href || pathname.startsWith(href + "/");
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

        <div
          style={{
            marginTop: "auto",
            padding: 12,
            borderRadius: 14,
            background: "#163B36",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: "#0D5C55",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              flex: "none",
            }}
          >
            أ
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>[اسم الموظف]</span>
            <span>أدمن</span>
          </span>
        </div>
      </aside>

      <main
        style={{
          flex: "1 1 600px",
          minWidth: 0,
          padding: "26px 32px 60px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {children}
      </main>
    </div>
  );
}
