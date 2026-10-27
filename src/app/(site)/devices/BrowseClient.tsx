"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isListed, useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { BrowseArt } from "./art";
import { DeviceCard } from "./DeviceCard";
import { FilterAside } from "./FilterAside";
import { applyFilters, EMPTY, parseFilters, serializeFilters, type Filters, type Sort } from "./filters";

const svg = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function BrowseClient() {
  const { state } = useDemo();
  const router = useRouter();
  const sp = useSearchParams();
  const spKey = sp.toString();

  const [f, setF] = useState<Filters>(() => parseFilters(sp));
  // Keys this page wrote to the URL itself; anything else (back/forward, a
  // link from the home page while mounted) re-reads the filters from the URL.
  const [written, setWritten] = useState<string[]>([]);
  const [syncedKey, setSyncedKey] = useState(spKey);
  if (spKey !== syncedKey) {
    setSyncedKey(spKey);
    if (!written.includes(spKey) && spKey !== serializeFilters(f)) setF(parseFilters(sp));
  }

  const commit = (next: Filters) => {
    setF(next);
    const qs = serializeFilters(next);
    setWritten((w) => [...w.slice(-20), qs]);
    router.replace(qs ? `${routes.devices}?${qs}` : routes.devices, { scroll: false });
  };
  const set = (p: Partial<Filters>) => commit({ ...f, ...p });
  const reset = () => commit(EMPTY);

  const items = applyFilters(state.devices.filter(isListed), f);
  const n = items.length;
  const countLabel = n === 1 ? "جهاز واحد متاح" : `${n} أجهزة متاحة`;

  return (
    <div>
      <BrowseArt />

      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E5EBE8" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 20px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 14, color: "#4A5A56", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <Link href={routes.home}>الرئيسية</Link>
            <span aria-hidden="true">›</span>
            <span>كل الأجهزة</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.3 }}>كل الأجهزة</h1>
              <p style={{ margin: "4px 0 0", color: "#4A5A56", fontSize: 17 }}>كل جهاز عليه علامة بتقولك اتفحص ولا هيتفحص عند الطلب، والضمان مكتوب عليه.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 14 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px", borderRadius: 999, background: "#F5F7F4", border: "1px solid #E5EBE8" }}>
                <span style={{ padding: "2px 10px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" {...svg} strokeWidth={2.6}><path d="M5 12l4 4 10-10" /></svg>تم الفحص
                </span>
                التقرير متاح دلوقتي
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px", borderRadius: 999, background: "#F5F7F4", border: "1px solid #E5EBE8" }}>
                <span style={{ padding: "2px 10px", borderRadius: 999, background: "#E6EDF7", color: "#24508F", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" {...svg} strokeWidth={2.4}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>يُفحص عند الطلب
                </span>
                بنفحصه قبل الشحن
              </span>
            </div>
          </div>
          <label style={{ position: "relative", display: "block" }}>
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث عن جهاز</span>
            <span style={{ position: "absolute", top: "50%", right: 18, transform: "translateY(-50%)", color: "#0D5C55", display: "flex" }}>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" {...svg} strokeWidth={1.8}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
            </span>
            <input
              type="search"
              className="br-input"
              value={f.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="ابحث باسم الجهاز: يونيت، أوتوكلاف، إندو موتور…"
              style={{ width: "100%", boxSizing: "border-box", minHeight: 56, padding: "0 52px 0 16px", borderRadius: 16, border: "1px solid #C9D4CF", background: "#F5F7F4", font: "inherit", fontSize: 17, color: "#12221F" }}
            />
          </label>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px 56px", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        <FilterAside f={f} set={set} reset={reset} />

        <div style={{ flex: "999 1 600px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 10px 10px 14px", borderRadius: 16, background: "#FFFFFF", border: "1px solid #DCE3DF" }}>
            <span style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 10 }} aria-live="polite">
              <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 10, background: "#F5F7F4", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" {...svg} strokeWidth={1.9}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>
              </span>
              {countLabel}
            </span>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#4A5A56" }}>
              ترتيب حسب
              <select
                className="br-input"
                value={f.sort}
                onChange={(e) => set({ sort: e.target.value as Sort })}
                style={{ minHeight: 42, padding: "0 10px", borderRadius: 10, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", color: "#12221F" }}
              >
                <option value="new">الأحدث</option>
                <option value="asc">من الأقل سعراً للأعلى</option>
                <option value="desc">من الأعلى سعراً للأقل</option>
              </select>
            </label>
          </div>

          {n > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {items.map((d) => (
                <DeviceCard key={d.id} d={d} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 24px", borderRadius: 24, background: "#FFFFFF", border: "1px dashed #9FB2AB", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <span style={{ width: 76, height: 76, borderRadius: 22, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="38" height="38" viewBox="0 0 24 24" {...svg} strokeWidth={1.6}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /><path d="M9 11h4" /></svg>
              </span>
              <div style={{ fontWeight: 700, fontSize: 20 }}>مفيش أجهزة بالمواصفات دي دلوقتي</div>
              <div style={{ color: "#4A5A56" }}>جرّب تغيّر التصفية، أو اطلب الجهاز وهنبلغك أول ما يتعرض.</div>
              <button type="button" className="br-ghost" onClick={reset} style={{ minHeight: 46, padding: "0 20px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", font: "inherit", fontWeight: 600, cursor: "pointer" }}>مسح التصفية</button>
            </div>
          )}

          <div style={{ marginTop: 10, padding: 28, borderRadius: 24, background: "#0F2A26", color: "#FFFFFF", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 18 }}>
            <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", gap: 16, alignItems: "center" }}>
              <span aria-hidden="true" style={{ flex: "none", width: 52, height: 52, borderRadius: 16, background: "#163A35", color: "#F2A33A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" {...svg} strokeWidth={1.8}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 22 }}>مش لاقي الجهاز اللي بتدوّر عليه؟</div>
                <div style={{ color: "#C3D3CE" }}>قولنا الجهاز والميزانية، وهنبلغك أول ما يتعرض جهاز مناسب.</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href={routes.request} className="br-cta-dark" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, background: "#F2A33A", color: "#12221F", fontWeight: 700, display: "flex", alignItems: "center" }}>اطلب جهاز</Link>
              <a
                href={waLink("أهلاً، بدوّر على جهاز أسنان مستعمل ومش لاقيه في «كل الأجهزة». ممكن تساعدوني؟")}
                target="_blank"
                rel="noopener noreferrer"
                className="br-ghost-dark"
                style={{ minHeight: 48, padding: "0 18px", borderRadius: 12, border: "1px solid #2E5650", color: "#FFFFFF", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...svg} strokeWidth={1.8}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" /></svg>
                واتساب
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
