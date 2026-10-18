import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/data";
import { formatPrice, formatYear } from "@/lib/site";
import type { Listing } from "@/lib/types";
import { Icon } from "./Icon";
import { InspectionBadge } from "./InspectionBadge";

export function ListingCard({ listing, showCategory = false }: { listing: Listing; showCategory?: boolean }) {
  const inspected = listing.inspectionState === "inspected";
  const meta = [showCategory && CATEGORY_LABELS[listing.category], formatYear(listing.year)]
    .filter(Boolean)
    .join(" · ");
  return (
    <Link
      href={`/devices/${listing.id}`}
      className="flex overflow-hidden rounded-[18px] border border-line bg-surface text-ink transition-shadow hover:text-ink hover:shadow-[0_10px_28px_rgba(18,34,31,0.08)] sm:flex-col"
    >
      {/* Phones: compact row with a square photo. Larger screens: photo on top. */}
      <div className="relative flex w-[112px] flex-none items-center justify-center bg-photo text-[13px] text-subtle sm:h-[170px] sm:w-auto">
        <Icon name="photo" size={28} strokeWidth={1.6} className="sm:hidden" />
        <span className="hidden sm:inline">{inspected ? "صورة من فريق الفحص" : "صورة من البايع"}</span>
        <InspectionBadge
          state={listing.inspectionState}
          size="sm"
          withIcon={false}
          className="absolute start-3 top-3 max-sm:hidden"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-3.5 py-3 sm:gap-1.5 sm:px-[18px] sm:py-4">
        <InspectionBadge state={listing.inspectionState} size="sm" className="self-start sm:hidden" />
        <div className="text-base font-bold sm:text-[17px]">{listing.title}</div>
        <div className="text-[13px] text-muted">{meta}</div>
        <div className="text-[13px] font-semibold text-primary">ضمان + صيانة {listing.maintenanceMonths} شهور</div>
        <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-2">
          <span className="text-base font-bold sm:text-lg">{formatPrice(listing.priceEgp)}</span>
          <span className="text-[13px] font-semibold text-primary max-sm:sr-only">التفاصيل ←</span>
        </div>
      </div>
    </Link>
  );
}
