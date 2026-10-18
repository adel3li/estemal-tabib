import Link from "next/link";
import { formatPrice, whatsappUrl } from "@/lib/site";
import type { Listing } from "@/lib/types";
import { Icon } from "./Icon";
import { INSPECTION_LABELS } from "./InspectionBadge";
import { btn } from "./ui";

/** Fixed bottom bar on phones: price, WhatsApp and the order button always in reach. */
export function MobileBuyBar({ listing }: { listing: Listing }) {
  const inspected = listing.inspectionState === "inspected";
  return (
    <>
      {/* Spacer so the bar never covers the end of the page. */}
      <div className="h-[84px] lg:hidden" aria-hidden />
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[640px] items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg leading-tight font-bold">{formatPrice(listing.priceEgp)}</div>
            <div className={`truncate text-xs font-semibold ${inspected ? "text-primary" : "text-info"}`}>
              {INSPECTION_LABELS[listing.inspectionState]} · فلوسك محفوظة لحد الاستلام
            </div>
          </div>
          <a
            href={whatsappUrl(`السلام عليكم، عندي سؤال عن: ${listing.title} (${listing.id})`)}
            target="_blank"
            rel="noopener"
            aria-label="اسأل على واتساب"
            className="flex size-12 flex-none items-center justify-center rounded-[14px] border border-field text-ink hover:text-ink"
          >
            <Icon name="chat" size={22} />
          </a>
          <Link href="/orders/1024" className={`${btn.primary} min-h-12 flex-none rounded-[14px] px-5 font-bold`}>
            {inspected ? "اطلب الجهاز" : "اطلب وابدأ الفحص"}
          </Link>
        </div>
      </div>
    </>
  );
}
