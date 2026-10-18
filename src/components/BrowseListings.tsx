"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/data";
import { EMPTY_FILTERS, type BrowseFilters } from "@/lib/filters";
import type { Category, Listing } from "@/lib/types";
import { Icon } from "./Icon";
import { ListingCard } from "./ListingCard";
import { chip } from "./ui";

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

  return (
    <>
      <section className="border-b border-line-soft bg-surface">
        <div className="mx-auto max-w-[1240px] px-4 pb-6 sm:px-5">
          <label className="relative block">
            <span className="sr-only">ابحث عن جهاز</span>
            <span className="pointer-events-none absolute start-4 top-1/2 flex -translate-y-1/2 text-subtle">
              <Icon name="search" size={22} />
            </span>
            <input
              type="search"
              value={f.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="ابحث باسم الجهاز: يونيت، أوتوكلاف، إندو موتور…"
              className="min-h-[54px] w-full rounded-[14px] border border-field bg-ground ps-[50px] pe-4 text-[17px] text-ink"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-7 px-4 pt-7 pb-10 sm:px-5">
        <aside
          aria-label="تصفية النتائج"
          className="flex min-w-0 flex-[1_1_260px] flex-col gap-[22px] rounded-[20px] border border-line bg-surface p-5 sm:p-[22px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">تصفية</span>
            <button type="button" onClick={reset} className="min-h-11 cursor-pointer px-3 font-semibold text-primary">
              مسح الكل
            </button>
          </div>
          <ChipGroup label="حالة الفحص" options={STATE_OPTIONS} value={f.state} onChange={(state) => set({ state })} />
          <ChipGroup label="نوع الجهاز" options={CAT_OPTIONS} value={f.cat} onChange={(cat) => set({ cat })} />
          <ChipGroup label="مدة الصيانة" options={MAINT_OPTIONS} value={f.maint} onChange={(maint) => set({ maint })} />
          <div className="flex items-start gap-2.5 rounded-[14px] bg-primary-soft p-3.5 text-sm text-primary-ink">
            <Icon name="lock" className="mt-0.5 flex-none" />
            <span>على كل الأجهزة: استبدال أو استرجاع 14 يوم، وضمان تشغيل 14 يوم، وفلوسك محفوظة لحد الاستلام.</span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-lg font-bold" aria-live="polite">
              {countLabel(items.length)}
            </span>
            <label className="flex items-center gap-2 text-[15px] text-muted">
              ترتيب حسب
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="min-h-11 rounded-[10px] border border-field bg-surface px-2.5 text-ink"
              >
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: من الأقل</option>
                <option value="price_desc">السعر: من الأعلى</option>
              </select>
            </label>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[18px]">
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
