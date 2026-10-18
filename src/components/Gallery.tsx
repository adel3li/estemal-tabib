import type { Listing } from "@/lib/types";
import { Icon, PlayIcon } from "./Icon";
import { InspectionBadge } from "./InspectionBadge";

/** Photo gallery placeholder until real photos are uploaded. */
export function Gallery({ listing, hasDefect }: { listing: Listing; hasDefect: boolean }) {
  const inspected = listing.inspectionState === "inspected";
  const accent = inspected ? "border-primary" : "border-info";
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex h-[300px] flex-col items-center justify-center gap-2 rounded-[20px] bg-photo text-subtle sm:h-[440px]">
        <Icon name="photo" size={44} strokeWidth={1.5} />
        <span>{inspected ? "صورة حقيقية للجهاز — تصوير فريق الفحص" : "صورة من البايع"}</span>
        <InspectionBadge state={listing.inspectionState} size="lg" className="absolute start-4 top-4" />
        {!inspected && (
          <span className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 px-3.5 py-2.5 text-sm font-medium text-info">
            الصور والفيديو من البايع. فريقنا هيصوّر الجهاز ويفحصه بعد طلبك.
          </span>
        )}
      </div>
      <div className={`grid gap-2.5 ${inspected && hasDefect ? "grid-cols-5" : "grid-cols-4"}`}>
        <div className={`h-[72px] rounded-xl border-2 bg-photo sm:h-[84px] ${accent}`} />
        <div className="h-[72px] rounded-xl bg-photo sm:h-[84px]" />
        <div className="h-[72px] rounded-xl bg-photo sm:h-[84px]" />
        {inspected && hasDefect && (
          <div className="flex h-[72px] items-center justify-center rounded-xl bg-warn-soft text-center text-xs font-semibold text-warn sm:h-[84px]">
            صورة العيب
          </div>
        )}
        <div className="flex h-[72px] flex-col items-center justify-center gap-0.5 rounded-xl bg-ink text-center text-xs text-white sm:h-[84px]">
          <PlayIcon />
          {inspected ? "فيديو وهو شغال" : "فيديو من البايع"}
        </div>
      </div>
    </div>
  );
}
