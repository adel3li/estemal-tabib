"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { DEVICE_TYPES, parseNum } from "@/lib/demo/labels";
import type { DeviceType } from "@/lib/demo/types";
import { useState } from "react";

const DAYS = BUSINESS.trialDays;

export function SellQuick() {
  const [type, setType] = useState<DeviceType>(DEVICE_TYPES[0].id);
  const [price, setPrice] = useState("");

  const qs = new URLSearchParams({ type });
  const priceNum = parseNum(price);
  if (priceNum) qs.set("price", String(priceNum));
  const sellHref = `${routes.sell}?${qs.toString()}`;

  return (
    <>
    <section id="sell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 76px" }}>
      <div className="mn-sell" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ alignSelf: "flex-start", width: 52, height: 52, borderRadius: 16, background: "#FBEEDC", color: "#C46A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12l-8 8-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
          </span>
          <h2 className="mn-h2 mn-h2-sm" style={{ margin: 0, fontWeight: 700 }}>عندك جهاز عايز تبيعه؟</h2>
          <p style={{ margin: 0, color: "#4A5A56" }} className="mn-lead">اعرض جهازك في دقايق، وإحنا نتابع الفحص والتسعير والشحن والتحصيل. من غير وسطاء ولا مشترين مش جادين.</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", marginTop: 3, width: 22, height: 22, borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              سعر عادل حسب حالة الجهاز وسعر السوق
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", marginTop: 3, width: 22, height: 22, borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              المشترين دكاترة أسنان بس
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", marginTop: 3, width: 22, height: 22, borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              فلوسك بتوصلك بعد {DAYS} أيام من استلام المشتري للجهاز
            </li>
          </ul>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="mn-sell-form" style={{ flex: "1 1 360px", minWidth: 0, borderRadius: 20, background: "#F5F7F4", border: "1px solid #E5EBE8", display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, fontSize: 14 }}>
            نوع الجهاز{" "}
            <select value={type} onChange={(e) => setType(e.target.value as DeviceType)} className="mn-field" style={{ minHeight: 46, padding: "0 12px", borderRadius: 10, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", fontWeight: 400 }}>
              {DEVICE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, fontSize: 14 }}>
            السعر المطلوب{" "}
            <input type="text" inputMode="numeric" autoComplete="off" enterKeyHint="done" value={price} onChange={(e) => setPrice(e.target.value)} className="mn-field" placeholder="ج.م" style={{ minHeight: 46, padding: "0 12px", borderRadius: 10, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", fontWeight: 400 }} />
          </label>
          <div className="mn-upload" style={{ padding: 18, borderRadius: 14, border: "1.5px dashed #9FB2AB", background: "#FBFCFB", textAlign: "center", color: "#4A5A56", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
            </span>
            {" "}ارفع صور وفيديو للجهاز وهو شغال
          </div>
          <Link href={sellHref} className="mn-amber" style={{ minHeight: 50, borderRadius: 12, background: "#F2A33A", color: "#12221F", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>كمّل بيانات جهازك</Link>
        </form>
      </div>
    </section>
    </>
  );
}
