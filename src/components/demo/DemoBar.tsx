"use client";

// Small floating control that only exists in the clickable demo: tells testers
// the data is local to their browser, lets them reset it or jump to the admin.
// Starts collapsed as a small pill so it never covers content on phones.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";

export function DemoBar() {
  const { reset } = useDemo();
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
      <p>الأجهزة وطلبات البيع والطلبات والمدفوعات حقيقية. الفحوصات وطلبات «اطلب جهاز» لسه تجريبية ومتخزنة في المتصفح ده بس.</p>
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
            if (window.confirm("ترجّع الفحوصات وطلبات «اطلب جهاز» التجريبية زي ما كانت؟ (البيانات الحقيقية مش هتتأثر)")) {
              reset();
              setOpen(false);
            }
          }}
        >
          رجّع التجريبي
        </button>
      </div>
    </div>
  );
}
