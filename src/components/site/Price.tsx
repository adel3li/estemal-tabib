// Price with the optional «السعر قبل الخصم» crossed out and «خصم X%».
import type { CSSProperties } from "react";
import { fmt } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";

export const discountPct = (d: Pick<Device, "price" | "compareAtPrice">) =>
  d.compareAtPrice && d.compareAtPrice > d.price ? Math.round((1 - d.price / d.compareAtPrice) * 100) : 0;

export function OldPrice({ d, style }: { d: Device; style?: CSSProperties }) {
  const pct = discountPct(d);
  if (!pct) return null;
  return (
    <span className="price-old" style={style}>
      <s aria-label={`كان ${fmt(d.compareAtPrice ?? 0)} جنيه`}>{fmt(d.compareAtPrice ?? 0)}</s>
      <span className="price-off">خصم {pct}%</span>
    </span>
  );
}
