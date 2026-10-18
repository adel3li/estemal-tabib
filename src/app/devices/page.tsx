import type { Metadata } from "next";
import Link from "next/link";
import { BrowseListings } from "@/components/BrowseListings";
import { DeviceRequest } from "@/components/DeviceRequest";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InspectionBadge } from "@/components/InspectionBadge";
import { CATEGORY_LABELS, LISTINGS } from "@/lib/data";
import { EMPTY_FILTERS, type BrowseFilters } from "@/lib/filters";

export const metadata: Metadata = { title: "كل الأجهزة" };

type Params = Record<string, string | string[] | undefined>;

function pick<T extends string>(value: Params[string], allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Reads ?state=&cat=&maint=&q= so category links from the home page land filtered. */
function filtersFrom(sp: Params): BrowseFilters {
  return {
    state: pick(sp.state, ["inspected", "inspect_on_order"] as const, EMPTY_FILTERS.state),
    cat: pick(sp.cat, Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[], EMPTY_FILTERS.cat),
    maint: pick(sp.maint, ["3", "6"] as const, EMPTY_FILTERS.maint),
    q: typeof sp.q === "string" ? sp.q : "",
  };
}

export default async function DevicesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const initial = filtersFrom(await searchParams);
  return (
    <>
      <Header />
      <main>
        <section className="bg-surface">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 pt-[18px] pb-4 sm:px-5">
            <nav aria-label="مسار الصفحة" className="text-sm text-muted">
              <Link href="/">الرئيسية</Link> / كل الأجهزة
            </nav>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="m-0 text-[30px] leading-tight sm:text-4xl">كل الأجهزة</h1>
                <p className="mt-1 mb-0 text-[17px] text-muted">
                  كل جهاز عليه علامة بتقولك اتفحص ولا هيتفحص عند الطلب، والضمان مكتوب عليه.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <InspectionBadge state="inspected" size="sm" withIcon={false} />
                  التقرير متاح دلوقتي
                </span>
                <span className="flex items-center gap-1.5">
                  <InspectionBadge state="inspect_on_order" size="sm" withIcon={false} />
                  بنفحصه قبل الشحن
                </span>
              </div>
            </div>
          </div>
        </section>
        <BrowseListings key={JSON.stringify(initial)} listings={LISTINGS} initial={initial} />
        <div className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-5">
          <DeviceRequest />
        </div>
      </main>
      <Footer />
    </>
  );
}
