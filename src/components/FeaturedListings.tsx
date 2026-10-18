"use client";

import { useState } from "react";
import type { Category, Listing } from "@/lib/types";
import { ListingCard } from "./ListingCard";
import { chip } from "./ui";

type Filter = "all" | "inspected" | Category;

const FILTERS: [Filter, string][] = [
  ["all", "الكل"],
  ["inspected", "تم الفحص فقط"],
  ["rotary", "روتاري"],
  ["camera", "كاميرا"],
  ["light_cure", "لايت كيور"],
  ["loupe", "لوب"],
  ["motor", "موتور"],
];

export function FeaturedListings({ listings, limit = 4 }: { listings: Listing[]; limit?: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = listings
    .filter((l) =>
      filter === "all" ? true : filter === "inspected" ? l.inspectionState === "inspected" : l.category === filter,
    )
    .slice(0, limit);

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="تصفية الأجهزة">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={chip(filter === key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:gap-5" aria-live="polite">
        {shown.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </>
  );
}
