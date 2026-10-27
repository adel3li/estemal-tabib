import type { Condition, DeviceType, DeviceStatus, InspectionState } from "./types";

/** Device types in form order (PHASE1_PROMPT.md §5). */
export const DEVICE_TYPES: { id: DeviceType; label: string }[] = [
  { id: "unit", label: "يونيت أسنان" },
  { id: "xray", label: "أشعة" },
  { id: "autoclave", label: "أوتوكلاف" },
  { id: "surg", label: "موتور جراحة وزراعة" },
  { id: "endo", label: "إندو موتور" },
  { id: "apex", label: "أبيكس لوكيتور" },
  { id: "cure", label: "لايت كيور" },
  { id: "rotary", label: "روتاري" },
  { id: "contra", label: "كونترا" },
  { id: "micro", label: "ميكرو موتور" },
  { id: "iocam", label: "كاميرا إنترا أورال" },
  { id: "cam", label: "كاميرا" },
  { id: "loupe", label: "لوب تكبير" },
  { id: "other", label: "جهاز تاني" },
];

export const typeLabel = (t: DeviceType) =>
  DEVICE_TYPES.find((x) => x.id === t)?.label ?? "جهاز تاني";

export const typeFromLabel = (label: string): DeviceType =>
  DEVICE_TYPES.find((x) => x.label === label)?.id ?? "other";

export const CONDITIONS: Record<Condition, { label: string; short: string; range: string }> = {
  a: { label: "ممتازة (81–100%)", short: "ممتازة", range: "81–100%" },
  b: { label: "جيدة (60–80%)", short: "جيدة", range: "60–80%" },
  c: { label: "أقل من 60%", short: "أقل من 60%", range: "أقل من 60%" },
};

export const INSPECTION_LABEL: Record<InspectionState, string> = {
  inspected: "تم الفحص",
  on_order: "يُفحص عند الطلب",
};

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  draft: "مسودة",
  published: "منشور",
  reserved: "محجوز",
  sold: "اتباع",
  hidden: "مخفي",
};

/** All 27 governorates, in the order used by Sell.dc.html. */
export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", "الشرقية", "الغربية",
  "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
  "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء",
] as const;

/** 120000 → «120,000» (the designs use Latin digits with commas). */
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Parses Latin or Arabic-Indic digits; returns 0 when empty/invalid. */
export function parseNum(input: string): number {
  const latin = String(input || "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[^0-9.]/g, "");
  const v = parseFloat(latin);
  return v > 0 ? v : 0;
}
