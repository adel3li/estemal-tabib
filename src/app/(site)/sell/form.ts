// Sell form state, validation and draft persistence (client-only helpers).
import { BUSINESS } from "@/config/business";
import { GOVERNORATES, parseNum } from "@/lib/demo/labels";
import type { Condition, DeviceType, YesNoUnknown } from "@/lib/demo/types";

export type YesNo = "" | "yes" | "no";
export type AckKey = "own" | "acc" | "terms";

/** Everything that can be saved as a draft (files can't — they stay in memory). */
export type SellForm = {
  fullName: string;
  phone: string;
  governorate: string;
  pickupAddress: string;
  lat?: number;
  lng?: number;
  deviceType: DeviceType;
  brand: string;
  details: string;
  accessories: string;
  saleReason: string;
  condition: Condition | "";
  wantsRepair: boolean;
  repairDescription: string;
  warranty: YesNo;
  warrantyRemaining: string;
  box: YesNo;
  repaired: "" | YesNoUnknown;
  repairedDetails: string;
  defects: string;
  keepLocation: "with_seller" | "send_to_platform";
  sale: string;
  net: string;
  priceHelp: boolean;
  acks: Record<AckKey, boolean>;
};

export type VideoPick = { file: File; seconds: number };
export type Media = { photos: File[]; video: VideoPick | null; extras: File[] };

export const EMPTY_FORM: SellForm = {
  fullName: "",
  phone: "",
  governorate: GOVERNORATES[0],
  pickupAddress: "",
  deviceType: "unit",
  brand: "",
  details: "",
  accessories: "",
  saleReason: "",
  condition: "",
  wantsRepair: false,
  repairDescription: "",
  warranty: "",
  warrantyRemaining: "",
  box: "",
  repaired: "",
  repairedDetails: "",
  defects: "",
  keepLocation: "with_seller",
  sale: "",
  net: "",
  priceHelp: false,
  acks: { own: false, acc: false, terms: false },
};

export const ACKS: { key: AckKey; label: string }[] = [
  { key: "own", label: "أقر إني المالك القانوني للجهاز أو معايا تفويض رسمي ببيعه، وإنه مش مرهون ولا عليه نزاع." },
  { key: "acc", label: "أقر إن كل البيانات والعيوب اللي كتبتها صحيحة، وإني هغلّف الجهاز تغليف آمن قبل تسليمه." },
  { key: "terms", label: "موافق على شروط البيع، وعلى إن الجهاز يفضل معروض على المنصة 7 أيام على الأقل." },
];

/** Field keys in page order — the first one with an error gets focus. */
export const FIELD_ORDER = [
  "fullName",
  "phone",
  "governorate",
  "pickupAddress",
  "deviceType",
  "brand",
  "details",
  "accessories",
  "saleReason",
  "condition",
  "repairDescription",
  "warranty",
  "box",
  "repaired",
  "defects",
  "photos",
  "video",
  "extras",
  "sale",
  "acks",
] as const;
export type FieldKey = (typeof FIELD_ORDER)[number];
export type Errors = Partial<Record<FieldKey, string>>;

/** DOM id of the element to scroll to / focus for a field. */
export const fieldId = (k: FieldKey) => `sl-f-${k}`;

/** «٠١٠٠ ١٢٣-٤٥٦٧» → «01001234567». */
export function normalizePhone(input: string): string {
  return input.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/[^0-9]/g, "");
}
export const isEgyptMobile = (input: string) => /^01[0125][0-9]{8}$/.test(normalizePhone(input));

const req = "الخانة دي مطلوبة";

export function validate(f: SellForm, m: Media): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = "اكتب اسمك بالكامل";
  if (!f.phone.trim()) e.phone = "اكتب رقم موبايلك";
  else if (!isEgyptMobile(f.phone)) e.phone = "الرقم لازم يكون 11 رقم ويبدأ بـ 01";
  if (!f.governorate) e.governorate = "اختار المحافظة";
  if (!f.pickupAddress.trim()) e.pickupAddress = "اكتب عنوان استلام الجهاز";
  if (!f.brand.trim()) e.brand = "اكتب الماركة";
  if (!f.details.trim()) e.details = "اكتب الموديل أو المواصفات";
  if (!f.accessories.trim()) e.accessories = "اكتب الملحقات، ولو مفيش اكتب: مفيش";
  if (!f.saleReason.trim()) e.saleReason = req;
  if (!f.condition && !f.wantsRepair) e.condition = "اختار حالة الجهاز، أو اختار إننا نصلّحه";
  if (f.wantsRepair && !f.repairDescription.trim()) e.repairDescription = "اوصفلنا العطل علشان نقدّر التصليح";
  if (!f.warranty) e.warranty = "اختار أيوه أو لأ";
  if (!f.box) e.box = "اختار أيوه أو لأ";
  if (!f.repaired) e.repaired = "اختار إجابة";
  if (!f.defects.trim()) e.defects = "اكتب العيوب، ولو مفيش اكتب: لا يوجد";
  const { min, max } = BUSINESS.photos;
  if (m.photos.length < min) e.photos = `محتاجين ${min} صور على الأقل`;
  else if (m.photos.length > max) e.photos = `أقصى عدد ${max} صور`;
  if (!m.video) e.video = "ضيف فيديو للجهاز وهو شغال";
  if (!f.priceHelp && !parseNum(f.sale)) e.sale = "اكتب السعر، أو علّم «ساعدوني أحدد السعر»";
  if (!f.acks.own || !f.acks.acc || !f.acks.terms) e.acks = "لازم توافق على الإقرارات الثلاثة";
  return e;
}

// ── Draft (PHASE1_PROMPT §6) ────────────────────────────────────────────────
const DRAFT_KEY = "istimal-tabib-sell-draft";

export function loadDraft(): Partial<SellForm> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<SellForm>) : null;
  } catch {
    return null;
  }
}

export function saveDraft(f: SellForm) {
  try {
    if (JSON.stringify(f) === JSON.stringify(EMPTY_FORM)) window.localStorage.removeItem(DRAFT_KEY);
    else window.localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
  } catch {
    /* storage blocked — the form still works */
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
