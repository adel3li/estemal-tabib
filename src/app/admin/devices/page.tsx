"use client";

// Ported from design-reference/Admin-Listings.dc.html
import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { typeLabel } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { ListingArtDefs } from "./art";
import { DevicePanel } from "./_list/DevicePanel";
import { DeviceRow } from "./_list/DeviceRow";
import { KPI_STATUS, ST, type TabKey, missingForPublish, tabOf, toggleOf } from "./_list/meta";
import { Toast, type ToastTone } from "./_ui/Toast";
import "./styles.css";

const TABS: [TabKey, string][] = [
  ["all", "الكل"],
  ["pub", "منشور"],
  ["draft", "مسودة"],
  ["res", "محجوز"],
  ["sold", "اتباع"],
];

export default function AdminDevicesPage() {
  const { state, updateDevice } = useDemo();
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [insp, setInsp] = useState<"all" | "inspected" | "on_order">("all");
  const [src, setSrc] = useState<"all" | "company" | "seller">("all");
  const [sel, setSel] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; tone: ToastTone } | null>(null);

  const items = state.devices;
  const counts: Record<TabKey, number> = { all: items.length, pub: 0, draft: 0, res: 0, sold: 0 };
  items.forEach((d) => counts[tabOf(d.status)]++);

  const needle = q.trim().toLowerCase();
  const base = items.filter((d) => {
    if (insp !== "all" && d.inspection !== insp) return false;
    if (src !== "all" && d.source !== src) return false;
    if (needle && `${d.title} ${typeLabel(d.type)} ${d.id} ${d.governorate}`.toLowerCase().indexOf(needle) < 0) return false;
    return true;
  });
  const tabCounts: Record<TabKey, number> = { all: base.length, pub: 0, draft: 0, res: 0, sold: 0 };
  base.forEach((d) => tabCounts[tabOf(d.status)]++);
  const rows = base.filter((d) => tab === "all" || tabOf(d.status) === tab);
  const hasFilters = !!needle || insp !== "all" || src !== "all" || tab !== "all";
  const clearFilters = () => {
    setQ("");
    setInsp("all");
    setSrc("all");
    setTab("all");
  };

  const p = sel ? items.find((d) => d.id === sel) : undefined;
  const pSub = p?.submissionId ? state.submissions.find((s) => s.id === p.submissionId) : undefined;

  const doToggle = (d: Device) => {
    const t = toggleOf(d);
    if (t.to === "published" && missingForPublish(d)) {
      setToast({ text: `«${d.title || d.id}» محتاج اسم وسعر قبل النشر — كمّله من «تعديل».`, tone: "bad" });
      setSel(d.id);
      return;
    }
    updateDevice(d.id, { status: t.to });
    setToast({ text: t.msg, tone: "ok" });
    setSel(d.id);
  };
  const doFeature = (d: Device) => {
    updateDevice(d.id, { featured: !d.featured });
    setToast({
      text: d.featured ? `اتشال التمييز من «${d.title}».` : `«${d.title}» بقى مميز وهيظهر في أول النتايج.`,
      tone: "ok",
    });
    setSel(d.id);
  };

  return (
    <>
      <ListingArtDefs />

      <div className="al-head" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الأجهزة › الأجهزة المعروضة</div>
          <h1 className="al-h1" style={{ margin: 0, lineHeight: 1.3 }}>الأجهزة المعروضة</h1>
          <div style={{ color: "#4A5A56" }}>كل الأجهزة اللي على المنصة، سواء ملك الشركة أو بالنيابة عن بايع. دوس على أي جهاز عشان تشوف تفاصيله.</div>
        </div>
        <Link href={routes.admin.newDevice} className="ad-btn ad-pri al-add" style={{ color: "#FFFFFF" }}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          إضافة جهاز
        </Link>
      </div>

      <div className="al-kpis" role="group" aria-label="ملخص الأجهزة">
        {(Object.keys(KPI_STATUS) as Exclude<TabKey, "all">[]).map((k) => {
          const look = ST[KPI_STATUS[k]];
          const on = tab === k;
          return (
            <button
              key={k}
              type="button"
              className="al-kpi"
              onClick={() => setTab(on ? "all" : k)}
              aria-pressed={on}
              aria-label={`${look.l}: ${counts[k]} — اعرضهم بس`}
              style={{ borderColor: on ? "#0D5C55" : "#DCE3DF", boxShadow: `0 0 0 ${on ? "2px" : "0"} ${on ? "rgba(13,92,85,.25)" : "transparent"}` }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#4A5A56" }}>{look.l}</span>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: look.dot }} />
              </span>
              <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>{counts[k]}</span>
              <span style={{ fontSize: 12, color: "#4A5A56" }}>{look.sub}</span>
            </button>
          );
        })}
      </div>

      {toast ? (
        <Toast tone={toast.tone} onClose={() => setToast(null)} floating>
          {toast.text}
        </Toast>
      ) : null}

      <section className="ad-card al-card" aria-label="قائمة الأجهزة" style={{ gap: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div role="tablist" aria-label="حالة الإعلان" className="al-tabs" style={{ gap: 4, padding: 4, borderRadius: 14, background: "#F5F7F4" }}>
            {TABS.map(([key, label]) => {
              const on = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  className="al-tab"
                  onClick={() => setTab(key)}
                  aria-selected={on}
                  style={{ background: on ? "#FFFFFF" : "transparent", color: on ? "#0D5C55" : "#3C4C48", boxShadow: on ? "0 2px 8px rgba(18,34,31,.08)" : "none" }}
                >
                  {label}
                  <span
                    style={{
                      minWidth: 22,
                      padding: "0 6px",
                      borderRadius: 999,
                      background: on ? "#0D5C55" : "#DCE3DF",
                      color: on ? "#FFFFFF" : "#3C4C48",
                      fontSize: 12,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {tabCounts[key]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="al-filters">
            <label className="al-search-wrap" style={{ position: "relative", display: "block" }}>
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ابحث في الأجهزة</span>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5A56" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", top: 14, right: 12 }}>
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-4.5-4.5" />
              </svg>
              <input
                type="search"
                className="ad-in al-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="اسم الجهاز، النوع، أو رقم الإعلان"
                style={{ paddingRight: 38 }}
              />
            </label>
            <label className="ad-field al-filter" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <span style={{ whiteSpace: "nowrap" }}>الفحص</span>
              <select className="ad-in al-w170" value={insp} onChange={(e) => setInsp(e.target.value as typeof insp)}>
                <option value="all">الكل</option>
                <option value="inspected">تم الفحص</option>
                <option value="on_order">يُفحص عند الطلب</option>
              </select>
            </label>
            <label className="ad-field al-filter" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <span style={{ whiteSpace: "nowrap" }}>المصدر</span>
              <select className="ad-in al-w130" value={src} onChange={(e) => setSrc(e.target.value as typeof src)}>
                <option value="all">الكل</option>
                <option value="company">الشركة</option>
                <option value="seller">بايع</option>
              </select>
            </label>
            {hasFilters ? (
              <button type="button" className="al-act" onClick={clearFilters}>
                امسح الفلاتر
              </button>
            ) : null}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#4A5A56" }}>
          بيظهر {rows.length} من {items.length} جهاز
        </div>

        <div className="al-listwrap" style={{ position: "relative" }}>
          <div style={{ overflowX: "auto" }}>
            <div className="al-tbl" role="table" aria-label="الأجهزة">
              <div className="al-thead" role="rowgroup">
                <div className="al-tr" role="row">
                  {["الجهاز", "النوع", "المصدر", "الفحص", "السعر", "الحالة", "مشاهدات · تاريخ", "إجراءات"].map((h) => (
                    <div key={h} className="al-th" role="columnheader">
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div className="al-tbody" role="rowgroup">
                {rows.map((d) => (
                  <DeviceRow
                    key={d.id}
                    d={d}
                    selected={sel === d.id}
                    onOpen={() => setSel(d.id)}
                    onToggle={() => doToggle(d)}
                    onFeature={() => doFeature(d)}
                  />
                ))}
              </div>
            </div>
          </div>

          {rows.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#4A5A56", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9FB2AB" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-4.5-4.5" />
              </svg>
              <div style={{ fontWeight: 700, color: "#12221F" }}>مفيش أجهزة بالفلاتر دي</div>
              <button type="button" className="al-act" onClick={clearFilters}>
                امسح الفلاتر وارجع للكل
              </button>
            </div>
          ) : null}

          {p ? (
            <DevicePanel d={p} sub={pSub} onClose={() => setSel(null)} onToggle={() => doToggle(p)} onFeature={() => doFeature(p)} />
          ) : null}
        </div>
      </section>
    </>
  );
}
