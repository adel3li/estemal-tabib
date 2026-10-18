import type { InspectionState } from "@/lib/types";
import { Icon } from "./Icon";

export const INSPECTION_LABELS: Record<InspectionState, string> = {
  inspected: "تم الفحص",
  inspect_on_order: "يُفحص عند الطلب",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-[13px]",
  lg: "px-3.5 py-[7px] text-sm",
};

/** «تم الفحص» is solid teal; «يُفحص عند الطلب» is soft blue (CLAUDE.md §2.1). */
export function InspectionBadge({
  state,
  size = "md",
  withIcon = true,
  className = "",
}: {
  state: InspectionState;
  size?: keyof typeof SIZES;
  withIcon?: boolean;
  className?: string;
}) {
  const inspected = state === "inspected";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold leading-normal ${SIZES[size]} ${
        inspected ? "bg-primary text-white" : "bg-info-soft text-info"
      } ${className}`}
    >
      {withIcon && <Icon name={inspected ? "check" : "search"} size={size === "sm" ? 14 : 16} strokeWidth={inspected ? 2.2 : 2} />}
      {INSPECTION_LABELS[state]}
    </span>
  );
}
