import type { Listing } from "./types";

export const SITE = {
  name: "استعمال طبيب",
  tagline: "أجهزة أسنان مستعملة بفحص وضمان",
  slogan: "من دكتور أسنان لدكتور أسنان… بثقة",
  /** International format without "+", e.g. "2010xxxxxxxx". Empty until decided. */
  whatsappNumber: "",
};

/** wa.me link with a prefilled message. Without a number, WhatsApp asks who to send it to. */
export function whatsappUrl(text: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

const egp = new Intl.NumberFormat("ar-EG");

export function formatPrice(price: number | null) {
  return `${price === null ? "[السعر]" : egp.format(price)} ج.م`;
}

export function formatYear(year: number | null) {
  return year === null ? "[السنة]" : String(year);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "[التاريخ]";
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function brandModel(l: Listing) {
  return l.brand && l.model ? `${l.brand} ${l.model}` : "[الماركة / الموديل]";
}
