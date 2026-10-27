// Visual maps from Admin-Listings.dc.html, keyed by the store's values.
import { BUSINESS } from "@/config/business";
import type { Device, DeviceSource, DeviceStatus, InspectionState } from "@/lib/demo/types";

/** Tabs/KPIs of the design. «مخفي» devices are counted under «مسودة» (both are not visible to buyers). */
export type TabKey = "all" | "pub" | "draft" | "res" | "sold";

export const tabOf = (s: DeviceStatus): Exclude<TabKey, "all"> =>
  s === "published" ? "pub" : s === "reserved" ? "res" : s === "sold" ? "sold" : "draft";

type Look = { l: string; bg: string; fg: string; dot: string; sub: string };

export const ST: Record<DeviceStatus, Look> = {
  published: { l: "منشور", bg: "#EAF5DD", fg: "#3F7A1F", dot: "#3F7A1F", sub: "ظاهر للمشترين في «كل الأجهزة»" },
  draft: { l: "مسودة", bg: "#EEF2F0", fg: "#4A5A56", dot: "#8A9A95", sub: "مخفي، مستني يتكمل أو يتنشر" },
  hidden: { l: "مخفي", bg: "#EEF2F0", fg: "#4A5A56", dot: "#8A9A95", sub: "مخفي، مستني يتكمل أو يتنشر" },
  reserved: { l: "محجوز", bg: "#FBEEDC", fg: "#8A4209", dot: "#F2A33A", sub: `محجوز بعربون ${BUSINESS.buyerReservationDepositEGP} ج.م` },
  sold: { l: "اتباع", bg: "#E6EDF7", fg: "#24508F", dot: "#24508F", sub: `الفلوس محفوظة لحد الاستلام + ${BUSINESS.trialDays} أيام` },
};

export const KPI_STATUS: Record<Exclude<TabKey, "all">, DeviceStatus> = {
  pub: "published",
  draft: "draft",
  res: "reserved",
  sold: "sold",
};

export const SRC: Record<DeviceSource, { l: string; bg: string; fg: string }> = {
  company: { l: "الشركة", bg: "#FBEEDC", fg: "#8A4209" },
  seller: { l: "بايع", bg: "#E3F0ED", fg: "#0D5C55" },
};

export const INSP: Record<InspectionState, { l: string; bg: string; fg: string; sbg: string; sfg: string }> = {
  inspected: { l: "تم الفحص", bg: "#E3F0ED", fg: "#0D5C55", sbg: "#0D5C55", sfg: "#FFFFFF" },
  on_order: { l: "يُفحص عند الطلب", bg: "#E6EDF7", fg: "#24508F", sbg: "#E6EDF7", sfg: "#24508F" },
};

export const canToggle = (d: Device) => d.status === "published" || d.status === "draft" || d.status === "hidden";

/** What «نشر / إخفاء» does for this device. */
export function toggleOf(d: Device) {
  if (d.status === "published")
    return { label: "إخفاء", fg: "#B3261E", to: "hidden" as const, msg: `اتخفى «${d.title}» من «كل الأجهزة».` };
  return { label: "نشر", fg: "#3F7A1F", to: "published" as const, msg: `اتنشر «${d.title}» وبقى ظاهر للمشترين.` };
}

/** A device can only go live with a name and a price (Admin.dc.html «قبل النشر»). */
export const missingForPublish = (d: Device) => !d.title.trim() || d.price <= 0;
