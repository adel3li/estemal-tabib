import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import "../_auth/auth.css";

export const metadata: Metadata = { title: "الصفحة دي للفريق بس", robots: { index: false } };

// Shown (HTTP 403) when a signed-in non-admin opens /admin — see src/middleware.ts.
export default function ForbiddenPage() {
  return (
    <div className="au-root">
      <section className="au-wrap">
        <div className="au-card" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="au-icon" style={{ background: "#FBEEDC", color: "#8A4209" }}>
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <h1 className="au-h1">الصفحة دي للفريق بس</h1>
          <p className="au-lead">لوحة التحكم مفتوحة لفريق استعمال طبيب. لو إنت من الفريق، كلم المسؤول يفعّل حسابك.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, width: "100%" }}>
            <Link href={routes.account} className="au-btn au-primary" style={{ flex: "1 1 160px" }}>
              حسابي
            </Link>
            <Link href={routes.home} className="au-btn au-google" style={{ flex: "1 1 160px" }}>
              الرئيسية
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
