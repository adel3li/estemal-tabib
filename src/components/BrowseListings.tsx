"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/data";
import { EMPTY_FILTERS, type BrowseFilters } from "@/lib/filters";
import type { Category, Listing } from "@/lib/types";
import { Icon } from "./Icon";
import { ListingCard } from "./ListingCard";
import { btn, chip } from "./ui";

type Sort = "newest" | "price_asc" | "price_desc";

const STATE_OPTIONS: [BrowseFilters["state"], string][] = [
  ["all", "الكل"],
  ["inspected", "تم الفحص"],
  ["inspect_on_order", "يُفحص عند الطلب"],
];

const CAT_OPTIONS: [BrowseFilters["cat"], string][] = [
  ["all", "الكل"],
  ...(Object.entries(CATEGORY_LABELS) as [Category, string][]),
];

const MAINT_OPTIONS: [BrowseFilters["maint"], string][] = [
  ["all", "الكل"],
  ["3", "3 شهور"],
  ["6", "6 شهور"],
];

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
      <legend className="mb-2.5 p-0 text-[15px] font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={chip(value === v)}>
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function countLabel(n: number) {
  if (n === 0) return "مفيش أجهزة";
  if (n === 1) return "جهاز واحد متاح";
  if (n === 2) return "جهازين متاحين";
  return `${n} أجهزة متاحة`;
}

function showLabel(n: number) {
  if (n === 0) return "مفيش أجهزة — غيّر التصفية";
  if (n === 1) return "اعرض جهاز واحد";
  if (n === 2) return "اعرض الجهازين";
  return `اعرض ${n} أجهزة`;
}

export function BrowseListings({ listings, initial }: { listings: Listing[]; initial: BrowseFilters }) {
  const [f, setF] = useState<BrowseFilters>(initial);
  const [sort, setSort] = useState<Sort>("newest");
  const set = (patch: Partial<BrowseFilters>) => setF((prev) => ({ ...prev, ...patch }));

  const items = useMemo(() => {
    const q = f.q.trim();
    const filtered = listings.filter((l) => {
      if (f.state !== "all" && l.inspectionState !== f.state) return false;
      if (f.cat !== "all" && l.category !== f.cat) return false;
      if (f.maint !== "all" && String(l.maintenanceMonths) !== f.maint) return false;
      if (q && !l.title.includes(q) && !CATEGORY_LABELS[l.category].includes(q)) return false;
      return true;
    });
    // Listings without a price yet sort last.
    const price = (l: Listing, fallback: number) => l.priceEgp ?? fallback;
    return filtered.sort((a, b) => {
      if (sort === "price_asc") return price(a, Infinity) - price(b, Infinity);
      if (sort === "price_desc") return price(b, -Infinity) - price(a, -Infinity);
      return b.listedAt.localeCompare(a.listedAt);
    });
  }, [listings, f, sort]);

  const reset = () => setF(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = [f.state, f.cat, f.maint].filter((v) => v !== "all").length;

  // While the phone filter sheet is open: lock page scroll, close on Escape.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const filterGroups = (
    <>
      <ChipGroup label="حالة الفحص" options={STATE_OPTIONS} value={f.state} onChange={(state) => set({ state })} />
      <ChipGroup label="نوع الجهاز" options={CAT_OPTIONS} value={f.cat} onChange={(cat) => set({ cat })} />
      <ChipGroup label="مدة الصيانة" options={MAINT_OPTIONS} value={f.maint} onChange={(maint) => set({ maint })} />
    </>
  );

  const sortSelect = (
    <label className="flex items-center gap-2 text-[15px] text-muted">
      <span className="max-sm:sr-only">ترتيب حسب</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        aria-label="ترتيب حسب"
        className="min-h-11 rounded-[10px] border border-field bg-surface px-2.5 text-ink"
      >
        <option value="newest">الأحدث</option>
        <option value="price_asc">السعر: من الأقل</option>
        <option value="price_desc">السعر: من الأعلى</option>
      </select>
    </label>
  );

  return (
    <>
      <section className="border-b border-line-soft bg-surface">
        <div className="mx-auto max-w-[1240px] px-4 pb-4 sm:px-5 sm:pb-6">
          <label className="relative block">
            <span className="sr-only">ابحث عن جهاز</span>
            <span className="pointer-events-none absolute start-4 top-1/2 flex -translate-y-1/2 text-subtle">
              <Icon name="search" size={22} />
            </span>
            <input
              type="search"
              value={f.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="ابحث باسم الجهاز: توربينة، لايت كيور، لوب…"
              className="min-h-[50px] w-full rounded-[14px] border border-field bg-ground ps-[50px] pe-4 text-base text-ink sm:min-h-[54px] sm:text-[17px]"
            />
          </label>
        </div>
      </section>

      {/* Phones: filter button + sort, sticky under the header. */}
      <div className="sticky top-[65px] z-30 border-b border-line-soft bg-ground/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center gap-2.5 px-4 py-2.5 sm:px-5">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-field bg-surface px-4 font-semibold"
          >
            <Icon name="filter" />
            تصفية
            {activeCount > 0 && (
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeCount.toLocaleString("ar-EG")}
              </span>
            )}
          </button>
          <div className="ms-auto">{sortSelect}</div>
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label="تصفية النتائج">
          <button type="button" aria-label="اقفل التصفية" onClick={() => setSheetOpen(false)} className="absolute inset-0 cursor-default bg-ink/40" />
          <div className="relative flex max-h-[85dvh] w-full flex-col rounded-t-3xl bg-surface">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-2">
              <button type="button" onClick={() => setSheetOpen(false)} aria-label="اقفل" className="flex size-11 cursor-pointer items-center justify-center">
                <Icon name="x" size={22} />
              </button>
              <span className="text-lg font-bold">تصفية</span>
              <button type="button" onClick={reset} className="min-h-11 cursor-pointer px-2 font-semibold text-primary">
                مسح الكل
              </button>
            </div>
            <div className="flex flex-col gap-[22px] overflow-y-auto px-4 py-5">{filterGroups}</div>
            <div className="pb-safe border-t border-line-soft px-4 pt-3">
              <button type="button" onClick={() => setSheetOpen(false)} className={`${btn.primary} min-h-[50px] w-full cursor-pointer text-[17px]`}>
                {showLabel(items.length)}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-7 px-4 pt-4 pb-10 sm:px-5 lg:pt-7">
        <aside
          aria-label="تصفية النتائج"
          className="hidden min-w-0 flex-[1_1_260px] flex-col gap-[22px] rounded-[20px] border border-line bg-surface p-[22px] lg:flex"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">تصفية</span>
            <button type="button" onClick={reset} className="min-h-11 cursor-pointer px-3 font-semibold text-primary">
              مسح الكل
            </button>
          </div>
          {filterGroups}
          <div className="flex items-start gap-2.5 rounded-[14px] bg-primary-soft p-3.5 text-sm text-primary-ink">
            <Icon name="lock" className="mt-0.5 flex-none" />
            <span>على كل الأجهزة: استبدال أو استرجاع 14 يوم، وضمان تشغيل 14 يوم، وفلوسك محفوظة لحد الاستلام.</span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-3 sm:gap-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-base font-bold sm:text-lg" aria-live="polite">
              {countLabel(items.length)}
            </span>
            <div className="max-lg:hidden">{sortSelect}</div>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:gap-[18px]">
              {items.map((l) => (
                <ListingCard key={l.id} listing={l} showCategory />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 rounded-[20px] border border-dashed border-[#9FB2AB] bg-surface px-6 py-12 text-center">
              <Icon name="search" size={36} strokeWidth={1.6} className="text-subtle" />
              <div className="text-[19px] font-bold">مفيش أجهزة بالمواصفات دي دلوقتي</div>
              <div className="text-muted">جرّب تغيّر التصفية، أو اطلب الجهاز وهنبلغك أول ما يتعرض.</div>
              <button
                type="button"
                onClick={reset}
                className="min-h-[46px] cursor-pointer rounded-xl border border-field bg-surface px-5 font-semibold"
              >
                مسح التصفية
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
