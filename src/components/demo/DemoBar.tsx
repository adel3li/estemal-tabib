"use client";

// Small floating control that only exists in the clickable demo: tells testers
// the data is local to their browser, lets them reset it or jump to the admin.
// Starts collapsed as a small pill so it never covers content on phones.
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
  const [open, setOpen] = useState(false);
  const inAdmin = pathname.startsWith("/admin");

  if (!open) {
    return (
      <button type="button" className="demo-pill" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="demo-panel">
        نسخة تجريبية
      </button>
    );
  }

  return (
    <div id="demo-panel" className="demo-panel" role="region" aria-label="نسخة تجريبية">
      <div className="demo-panel-head">
        <b>نسخة تجريبية</b>
        <button type="button" className="demo-x" onClick={() => setOpen(false)} aria-label="اقفل">
          ×
        </button>
      </div>
      <p>البيانات متخزنة في المتصفح ده بس. اللي بتعمله في لوحة التحكم بيظهر على الموقع عندك انت.</p>
      <div className="demo-actions">
        {inAdmin ? (
          <Link href={routes.home} onClick={() => setOpen(false)}>
            افتح الموقع
          </Link>
        ) : (
          <Link href={routes.admin.devices} onClick={() => setOpen(false)}>
            افتح لوحة التحكم
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm("ترجّع كل البيانات التجريبية زي ما كانت في الأول؟")) {
              reset();
              resetOrders();
              setOpen(false);
            }
          }}
        >
          رجّع البيانات
        </button>
      </div>
    </div>
  );
}
