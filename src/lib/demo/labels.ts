import type { BuiltinType, Condition, DeviceType, DeviceStatus, InspectionState } from "./types";

/**
 * Device categories (table device_categories, editable from «الأنواع» in the
 * dashboard). The built-in list below is the starting point until the
 * database answers; `setCategories` updates everything in place, so
 * `DEVICE_TYPES`, `typeLabel` etc. stay simple imports.
 * Order: the client's priority groups first (motors, rotary, cameras, loupes,
 * light cure), then everything else, «جهاز تاني» last.
 */
export const BUILTIN_TYPES: { id: BuiltinType; label: string }[] = [
  { id: "surg", label: "موتور جراحة وزراعة" },
  { id: "endo", label: "إندو موتور" },
  { id: "micro", label: "ميكرو موتور" },
  { id: "rotary", label: "روتاري" },
  { id: "contra", label: "كونترا" },
  { id: "iocam", label: "كاميرا إنترا أورال" },
  { id: "cam", label: "كاميرا" },
  { id: "loupe", label: "لوب تكبير" },
  { id: "cure", label: "لايت كيور" },
  { id: "unit", label: "يونيت أسنان" },
  { id: "xray", label: "أشعة" },
  { id: "autoclave", label: "أوتوكلاف" },
  { id: "apex", label: "أبيكس لوكيتور" },
  { id: "other", label: "جهاز تاني" },
];

export type FieldKind = "text" | "number" | "select";
export type CategoryField = { key: string; label: string; kind: FieldKind; options?: string[]; unit?: string };
export type Category = { id: DeviceType; label: string; sort: number; active: boolean; art: BuiltinType; fields: CategoryField[] };

const isBuiltin = (t: string): t is BuiltinType => BUILTIN_TYPES.some((b) => b.id === t);
const ALL = new Map<string, Category>(BUILTIN_TYPES.map((b, i) => [b.id, { id: b.id, label: b.label, sort: (i + 1) * 10, active: true, art: b.id, fields: [] }]));

/** Active categories in display order — used by every form and filter. Updated in place. */
export const DEVICE_TYPES: { id: DeviceType; label: string }[] = [...BUILTIN_TYPES];

let version = 0;
const listeners = new Set<() => void>();

/** Called with the rows from device_categories. */
export function setCategories(list: Category[]) {
  ALL.clear();
  list.forEach((c) => ALL.set(c.id, { ...c, art: isBuiltin(c.art) ? c.art : "other", fields: Array.isArray(c.fields) ? c.fields : [] }));
  const active = list.filter((c) => c.active).sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
  DEVICE_TYPES.splice(0, DEVICE_TYPES.length, ...active.map((c) => ({ id: c.id, label: c.label })));
  version++;
  listeners.forEach((l) => l());
}
export const categoriesVersion = () => version;
export const subscribeCategories = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
/** Every category (also hidden ones), for the admin page. */
export const allCategories = () => [...ALL.values()].sort((a, b) => a.sort - b.sort);

export const typeLabel = (t: DeviceType) => ALL.get(t)?.label ?? "جهاز تاني";
/** Which built-in drawing to use for a category. */
export const artKey = (t: DeviceType): BuiltinType => ALL.get(t)?.art ?? (isBuiltin(t) ? t : "other");
/** The category's own detail fields (e.g. camera → memory). */
export const categoryFields = (t: DeviceType): CategoryField[] => ALL.get(t)?.fields ?? [];

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
