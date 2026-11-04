"use client";

// /devices — v2 direction (design-explorations/v2/src/browse.html, brand theme).
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { isListed, useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { BrowseArt } from "./art";
import { DeviceCard } from "./DeviceCard";
import { FILTER_LABELS, FilterAside } from "./FilterAside";
import { applyFilters, EMPTY, parseFilters, serializeFilters, type Filters, type Sort } from "./filters";

const svg = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** The «مش لاقي…» bar sits inside the grid after this many cards. */
const REQ_AFTER = 6;

const labelOf = <T extends string>(opts: { id: T; label: string }[], id: T) => opts.find((o) => o.id === id)?.label ?? id;

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

  const listed = state.devices.filter(isListed);
  const items = applyFilters(listed, f);
  const countWith = (p: Partial<Filters>) => applyFilters(listed, { ...f, ...p }).length;
  const n = items.length;
  const countLabel = n === 1 ? "جهاز واحد متاح" : `${n} أجهزة متاحة`;

  const { ST_OPTS, CAT_OPTS, MAINT_OPTS, COND_OPTS } = FILTER_LABELS;
  const chips: { label: string; clear: Partial<Filters> }[] = [
    ...(f.st !== "all" ? [{ label: labelOf(ST_OPTS, f.st), clear: { st: "all" as const } }] : []),
    ...(f.cat !== "all" ? [{ label: labelOf(CAT_OPTS, f.cat), clear: { cat: "all" as const } }] : []),
    ...(f.cond !== "all" ? [{ label: labelOf(COND_OPTS, f.cond), clear: { cond: "all" as const } }] : []),
    ...(f.maint !== "all" ? [{ label: `ضمان ${labelOf(MAINT_OPTS, f.maint)}`, clear: { maint: "all" as const } }] : []),
    ...(f.pmin || f.pmax ? [{ label: `السعر ${f.pmin || "0"}–${f.pmax || "أي سعر"}`, clear: { pmin: "", pmax: "" } }] : []),
  ];
  const active = chips.length;

  // < 1024px the filters live in a sheet opened by the «تصفية» button.
  const [sheet, setSheet] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeSheet = useCallback(() => {
    setSheet(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const reqBar = (
    <div className="br-reqbar" key="req">
      <div>
        <b>مش لاقي الجهاز اللي بتدوّر عليه؟</b>
        <p>قولنا الجهاز والميزانية، وهنبلغك أول ما يتعرض جهاز مناسب.</p>
      </div>
      <div className="br-reqbar-acts">
        <Link href={routes.request} className="hm-btn hm-btn-line br-btn-sm">اطلب جهاز</Link>
        <a
          href={waLink("أهلاً، بدوّر على جهاز أسنان مستعمل ومش لاقيه في «كل الأجهزة». ممكن تساعدوني؟")}
          target="_blank"
          rel="noopener noreferrer"
          className="hm-tlink"
        >
          أو كلمنا واتساب
        </a>
      </div>
    </div>
  );

  return (
    <div className="hm-page br-page">
      <BrowseArt />

      <div className="hm-wrap">
        <nav className="br-crumbs" aria-label="مسار الصفحة">
          <Link href={routes.home}>الرئيسية</Link>
          <span aria-hidden="true">/</span>
          <b>كل الأجهزة</b>
        </nav>
        <div className="br-head">
          <div>
            <div className="hm-eyebrow">أجهزة أسنان مستعملة</div>
            <h1 className="br-title">كل الأجهزة</h1>
            <p className="br-count">كل جهاز عليه علامة بتقولك اتفحص ولا هيتفحص عند الطلب، والضمان مكتوب عليه.</p>
            <div className="br-legend">
              <span className="hm-status hm-ok"><span className="hm-d" aria-hidden="true" />تم الفحص<em>التقرير متاح دلوقتي</em></span>
              <span className="hm-status hm-ord"><span className="hm-d" aria-hidden="true" />يُفحص عند الطلب<em>بنفحصه قبل الشحن</em></span>
            </div>
            <div className="br-count" aria-live="polite">{countLabel}</div>
          </div>
          <label className="br-sort">
            <span className="br-sort-label">ترتيب حسب</span>
            <select className="br-input" aria-label="ترتيب حسب" value={f.sort} onChange={(e) => set({ sort: e.target.value as Sort })}>
              <option value="new">الأحدث</option>
              <option value="asc">من الأقل سعراً للأعلى</option>
              <option value="desc">من الأعلى سعراً للأقل</option>
            </select>
          </label>
        </div>

        <div className="br-layout">
          <FilterAside f={f} set={set} reset={reset} countWith={countWith} open={sheet} onClose={closeSheet} count={n} />

          <div style={{ minWidth: 0 }}>
            <div className="br-tools">
              <label className="br-search">
                <span className="br-sr">ابحث عن جهاز</span>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...svg} strokeWidth={1.8}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
                <input
                  type="search"
                  className="br-input"
                  value={f.q}
                  onChange={(e) => set({ q: e.target.value })}
                  placeholder="ابحث باسم الجهاز: يونيت، أوتوكلاف، إندو موتور…"
                />
              </label>
              <button ref={triggerRef} type="button" className="br-filter-btn" onClick={() => setSheet(true)} aria-haspopup="dialog" aria-expanded={sheet} aria-controls="br-filters">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...svg} strokeWidth={1.9}><path d="M4 5h16l-6 8v5l-4 2v-7z" /></svg>
                تصفية
                {active ? <span className="br-filter-n" aria-label={`${active} فلتر مفعّل`}>{active}</span> : null}
              </button>
            </div>

            {active ? (
              <div className="br-active">
                <span>التصفية:</span>
                {chips.map((c) => (
                  <button key={c.label} type="button" onClick={() => set(c.clear)} aria-label={`شيل ${c.label}`}>
                    {c.label} <span aria-hidden="true">✕</span>
                  </button>
                ))}
                <button type="button" className="br-active-clear" onClick={reset}>امسح الكل</button>
              </div>
            ) : null}

            {n > 0 ? (
              <div className="br-grid">
                {items.flatMap((d, i) => {
                  const card = <DeviceCard key={d.id} d={d} />;
                  return i === Math.min(REQ_AFTER, n) - 1 ? [card, reqBar] : [card];
                })}
              </div>
            ) : (
              <div className="br-empty">
                <b>مفيش أجهزة بالمواصفات دي دلوقتي</b>
                <p>جرّب تغيّر التصفية، أو اطلب الجهاز وهنبلغك أول ما يتعرض.</p>
                <div className="br-reqbar-acts">
                  <button type="button" className="hm-btn hm-btn-line br-btn-sm" onClick={reset}>مسح التصفية</button>
                  <Link href={routes.request} className="hm-tlink">اطلب جهاز</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
