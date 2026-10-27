"use client";

import { CONDITIONS, fmt, parseNum, typeLabel } from "@/lib/demo/labels";
import type { FormState } from "./model";

export type Check = { label: string; ok: boolean };

export function PreviewAside({ f, checks }: { f: FormState; checks: Check[] }) {
  const price = parseNum(f.price);
  const done = f.insp === "inspected";
  return (
    <aside className="adf-aside" style={{ flex: "1 1 320px", minWidth: 0, position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        المشتري هيشوفه كده
      </div>
      <div style={{ borderRadius: 20, border: "1px solid #DCE3DF", background: "#FFFFFF", overflow: "hidden", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.08)" }}>
        <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
          <svg aria-hidden="true" viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "100%" }}>
            <use href="#ad-front" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              padding: "4px 10px",
              borderRadius: 999,
              background: done ? "#0D5C55" : "#E6EDF7",
              color: done ? "#FFFFFF" : "#24508F",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {done ? "تم الفحص" : "يُفحص عند الطلب"}
          </span>
          {f.src === "company" ? (
            <span style={{ position: "absolute", bottom: 12, left: 12, padding: "4px 10px", borderRadius: 999, background: "#F2A33A", color: "#12221F", fontSize: 12, fontWeight: 700 }}>
              من استعمال طبيب
            </span>
          ) : null}
        </div>
        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{f.title.trim() ? f.title : "اسم الجهاز"}</div>
          <div style={{ fontSize: 13, color: "#4A5A56" }}>
            {typeLabel(f.type)} · {f.governorate}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={{ padding: "2px 10px", borderRadius: 999, background: "#F5F7F4", fontSize: 12, fontWeight: 600, color: "#3C4C48" }}>
              الحالة: {CONDITIONS[f.cond].label}
            </span>
            <span style={{ padding: "2px 10px", borderRadius: 999, background: "#E3F0ED", fontSize: 12, fontWeight: 600, color: "#0D5C55" }}>صيانة {f.maint} شهور</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #E5EBE8", marginTop: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 20 }}>
              {price ? fmt(price) : "—"} <span style={{ fontSize: 13, color: "#4A5A56" }}>ج.م</span>
            </span>
            <span style={{ fontSize: 13, color: "#0D5C55", fontWeight: 600 }}>التفاصيل ←</span>
          </div>
        </div>
      </div>
      <div style={{ padding: 16, borderRadius: 18, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
        <div style={{ fontWeight: 700 }}>قبل النشر</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {checks.map((k) => (
            <li key={k.label} style={{ display: "flex", alignItems: "center", gap: 8, color: k.ok ? "#12221F" : "#4A5A56" }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: k.ok ? "#0D5C55" : "#C9D4CF",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flex: "none",
                }}
                aria-hidden="true"
              >
                ✓
              </span>
              {k.label}
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{k.ok ? " — جاهز" : " — ناقص"}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
