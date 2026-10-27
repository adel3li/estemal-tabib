// Form model for «إضافة جهاز / تعديل» (Admin.dc.html) + mapping to/from the demo store.
import { BUSINESS, sellerNetFromSalePrice, type MaintenanceMonths } from "@/config/business";
import { CONDITIONS, parseNum } from "@/lib/demo/labels";
import { CORE_CHECKS } from "@/lib/demo/seed";
import type {
  Condition,
  Device,
  DeviceSource,
  DeviceType,
  InspectionReport,
  InspectionState,
  Submission,
  YesNoUnknown,
} from "@/lib/demo/types";

export const LOCATIONS = ["مقر الفحص", "المخزن", "عند المورّد", "عند البايع"] as const;
export const EFFICIENCY = ["ممتاز", "جيد جداً", "جيد"] as const;

export type FormState = {
  src: DeviceSource;
  submissionId: string;
  sellerNet: string;
  netTouched: boolean;
  saleReason: string;
  purchaseCost: string;
  locationNow: string;
  title: string;
  type: DeviceType;
  brand: string;
  model: string;
  year: string;
  governorate: string;
  accessories: string;
  insp: InspectionState;
  technician: string;
  inspDate: string; // yyyy-mm-dd from <input type="date">
  efficiency: string;
  cond: Condition;
  defects: string;
  price: string;
  maint: MaintenanceMonths;
  notes: string;
  hasBox?: boolean;
  repairedBefore?: YesNoUnknown;
};

export const emptyForm = (): FormState => ({
  src: "company",
  submissionId: "",
  sellerNet: "",
  netTouched: false,
  saleReason: "",
  purchaseCost: "",
  locationNow: "مقر الفحص",
  title: "",
  type: "autoclave",
  brand: "",
  model: "",
  year: "",
  governorate: "القاهرة",
  accessories: "",
  insp: "inspected",
  technician: "",
  inspDate: "",
  efficiency: "ممتاز",
  cond: "a",
  defects: "",
  price: "",
  maint: BUSINESS.maintenanceMonthsOptions[0],
  notes: "",
});

/** Placeholder values from the seed («[الماركة]») shouldn't be shown as typed text. */
const real = (v: string | undefined) => (v && !/^\[.*\]$/.test(v.trim()) ? v : "");

export function formFromDevice(d: Device): FormState {
  return {
    ...emptyForm(),
    src: d.source,
    submissionId: d.submissionId ?? "",
    sellerNet: d.sellerNet ? String(d.sellerNet) : "",
    netTouched: d.sellerNet !== undefined && d.sellerNet !== sellerNetFromSalePrice(d.price),
    saleReason: d.saleReason ?? "",
    purchaseCost: d.purchaseCost ? String(d.purchaseCost) : "",
    locationNow: d.locationNow ?? "مقر الفحص",
    title: d.title,
    type: d.type,
    brand: real(d.brand),
    model: real(d.model),
    year: real(d.year),
    governorate: d.governorate,
    accessories: d.accessories,
    insp: d.inspection,
    technician: real(d.report?.technician),
    efficiency: d.report?.efficiency && EFFICIENCY.includes(d.report.efficiency as (typeof EFFICIENCY)[number]) ? d.report.efficiency : "ممتاز",
    cond: d.condition,
    defects: d.declaredDefects,
    price: d.price ? String(d.price) : "",
    maint: d.maintenanceMonths,
    notes: d.internalNotes ?? "",
    hasBox: d.hasBox,
    repairedBefore: d.repairedBefore,
  };
}

/** «بالنيابة عن بايع» → copy the seller's request into the form. */
export function applySubmission(f: FormState, s: Submission): FormState {
  return {
    ...f,
    src: "seller",
    submissionId: s.id,
    title: s.details,
    type: s.deviceType,
    brand: real(s.brand),
    year: s.year,
    governorate: s.governorate,
    accessories: s.accessories === "—" ? "" : s.accessories,
    cond: s.condition,
    price: s.salePrice ? String(s.salePrice) : "",
    defects: s.defects,
    hasBox: s.hasBox,
    repairedBefore: s.repairedBefore,
    sellerNet: s.sellerNet ? String(s.sellerNet) : "",
    netTouched: s.sellerNet !== sellerNetFromSalePrice(s.salePrice),
    saleReason: s.saleReason,
    locationNow: s.keepLocation === "send_to_platform" ? "مقر الفحص" : "عند البايع",
  };
}

const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
/** 2026-10-27 → «27 أكتوبر 2026». */
export function arabicDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export const netOf = (f: FormState) =>
  f.netTouched ? parseNum(f.sellerNet) : sellerNetFromSalePrice(parseNum(f.price));

/** Minimal report for a device marked «تم الفحص» that doesn't have one yet. */
function buildReport(f: FormState, existing?: InspectionReport): InspectionReport {
  const date = arabicDate(f.inspDate);
  if (existing) {
    return {
      ...existing,
      technician: f.technician.trim() || existing.technician,
      efficiency: f.efficiency || existing.efficiency,
      date: date || existing.date,
    };
  }
  return {
    no: "[###]",
    date: date || "[التاريخ]",
    serial: "[S/N]",
    technician: f.technician.trim() || "[اسم الفني]",
    efficiency: f.efficiency,
    appearance: CONDITIONS[f.cond].short,
    replacedParts: "[القطع]",
    checklist: CORE_CHECKS.map(({ label }) => ({ label, result: "pass" as const })),
    defects: f.defects.trim() ? [f.defects.trim()] : [],
  };
}

/** Everything the store needs except id / views / createdAt / status / featured. */
export function deviceFields(f: FormState, base?: Device): Omit<Device, "id" | "views" | "createdAt" | "status" | "featured"> {
  const seller = f.src === "seller";
  return {
    title: f.title.trim(),
    type: f.type,
    brand: f.brand.trim() || "[الماركة]",
    model: f.model.trim() || "[الموديل]",
    year: f.year.trim() || "[السنة]",
    origin: base?.origin ?? "[البلد]",
    capacity: base?.capacity,
    governorate: f.governorate,
    price: parseNum(f.price),
    condition: f.cond,
    inspection: f.insp,
    maintenanceMonths: f.maint,
    source: f.src,
    accessories: f.accessories.trim(),
    declaredDefects: f.defects.trim(),
    hasBox: f.hasBox,
    repairedBefore: f.repairedBefore,
    report: f.insp === "inspected" ? buildReport(f, base?.report) : base?.report,
    purchaseCost: !seller && parseNum(f.purchaseCost) ? parseNum(f.purchaseCost) : undefined,
    sellerNet: seller ? netOf(f) || undefined : undefined,
    saleReason: seller ? f.saleReason || undefined : undefined,
    internalNotes: f.notes.trim() || undefined,
    locationNow: f.locationNow,
    submissionId: seller && f.submissionId ? f.submissionId : undefined,
  };
}
