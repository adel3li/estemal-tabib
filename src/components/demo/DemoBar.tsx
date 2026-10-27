"use client";

// Small floating bar that only exists in the clickable demo: tells testers the
// data is local to their browser, and lets them reset it or jump to the admin.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { useOrders } from "@/lib/demo/orders";
import { routes } from "@/lib/routes";

export function DemoBar() {
  const { reset } = useDemo();
  const { reset: resetOrders } = useOrders();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(true);
  const inAdmin = pathname.startsWith("/admin");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="إظهار شريط النسخة التجريبية"
        style={{
          position: "fixed",
          bottom: 14,
          left: 14,
          zIndex: 60,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: 0,
          background: "#12221F",
          color: "#F2A33A",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        }}
      >
        ؟
      </button>
    );
  }

  const sep = <span aria-hidden style={{ opacity: 0.4 }}>·</span>;
  const linkStyle = { color: "#F2A33A", fontWeight: 700, background: "none", border: 0, cursor: "pointer", font: "inherit", padding: 0 } as const;

  return (
    <div
      className="demo-bar"
      role="region"
      aria-label="نسخة تجريبية"
      style={{
        position: "fixed",
        bottom: 14,
        left: 14,
        zIndex: 60,
        maxWidth: "calc(100vw - 28px)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        background: "#12221F",
        color: "#E3F0ED",
        fontSize: 13,
        lineHeight: 1.5,
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      }}
    >
      <span>
        <b style={{ color: "#FFFFFF" }}>نسخة تجريبية</b> — البيانات متخزنة في المتصفح ده بس
      </span>
      {sep}
      {inAdmin ? (
        <Link href={routes.home} style={linkStyle}>الموقع</Link>
      ) : (
        <Link href={routes.admin.devices} style={linkStyle}>لوحة التحكم</Link>
      )}
      {sep}
      <button
        type="button"
        style={linkStyle}
        onClick={() => {
          if (window.confirm("ترجّع كل البيانات التجريبية زي ما كانت في الأول؟")) {
            reset();
            resetOrders();
          }
        }}
      >
        رجّع البيانات
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="إخفاء الشريط"
        style={{ ...linkStyle, color: "#9FB8B1", fontSize: 16, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
