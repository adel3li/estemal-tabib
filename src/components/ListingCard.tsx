import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/data";
import { formatPrice, formatYear } from "@/lib/site";
import type { Listing } from "@/lib/types";
import { InspectionBadge } from "./InspectionBadge";

export function ListingCard({ listing, showCategory = false }: { listing: Listing; showCategory?: boolean }) {
  const inspected = listing.inspectionState === "inspected";
  const meta = [showCategory && CATEGORY_LABELS[listing.category], formatYear(listing.year), listing.governorate]
    .filter(Boolean)
    .join(" · ");
  return (
    <Link
      href={`/devices/${listing.id}`}
      className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface text-ink transition-shadow hover:text-ink hover:shadow-[0_10px_28px_rgba(18,34,31,0.08)]"
    >
      <div className="relative flex h-[170px] items-center justify-center bg-photo text-[13px] text-subtle">
        {inspected ? "صورة من فريق الفحص" : "صورة من البايع"}
        <InspectionBadge state={listing.inspectionState} size="sm" withIcon={false} className="absolute start-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-[18px] py-4">
        <div className="text-[17px] font-bold">{listing.title}</div>
        <div className="text-[13px] text-muted">{meta}</div>
        <div className="text-[13px] font-semibold text-primary">ضمان + صيانة {listing.maintenanceMonths} شهور</div>
        <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-2">
          <span className="text-lg font-bold">{formatPrice(listing.priceEgp)}</span>
          <span className="text-[13px] font-semibold text-primary">التفاصيل ←</span>
        </div>
      </div>
    </Link>
  );
}
