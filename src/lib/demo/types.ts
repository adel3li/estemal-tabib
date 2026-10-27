// Demo data model. Mirrors PHASE1_PROMPT.md §7 closely enough that the
// Supabase version can replace the store without changing pages much.

export type DeviceType =
  | "unit"
  | "xray"
  | "autoclave"
  | "surg"
  | "endo"
  | "apex"
  | "cure"
  | "rotary"
  | "contra"
  | "micro"
  | "iocam"
  | "cam"
  | "loupe"
  | "other";

/** a = ممتازة 81–100% · b = جيدة 60–80% · c = أقل من 60% */
export type Condition = "a" | "b" | "c";
export type InspectionState = "inspected" | "on_order";
export type DeviceStatus = "draft" | "published" | "reserved" | "sold" | "hidden";
export type DeviceSource = "company" | "seller";
export type YesNoUnknown = "yes" | "no" | "unknown";

export type ChecklistRow = {
  label: string;
  result: "pass" | "note" | "fail";
  note?: string;
};

export type InspectionReport = {
  no: string; // «رقم التقرير»
  date: string;
  serial: string;
  technician: string;
  efficiency: string; // e.g. «ممتاز»
  appearance: string; // e.g. «جيد جداً»
  replacedParts: string;
  checklist: ChecklistRow[];
  defects: string[];
};

export type Device = {
  id: string; // public code, also the URL segment: /devices/L-201
  title: string;
  type: DeviceType;
  brand: string;
  model: string;
  year: string; // string so placeholders like «[السنة]» survive
  origin: string;
  capacity?: string; // e.g. autoclave «[السعة] لتر»
  governorate: string;
  price: number; // EGP
  condition: Condition;
  inspection: InspectionState;
  maintenanceMonths: 3 | 6;
  status: DeviceStatus;
  featured: boolean;
  views: number;
  source: DeviceSource;
  createdAt: string; // display date, e.g. «12 أكتوبر 2026»
  accessories: string;
  declaredDefects: string;
  hasBox?: boolean;
  repairedBefore?: YesNoUnknown;
  report?: InspectionReport;
  // ── admin-only ────────────────────────────────────────────
  purchaseCost?: number;
  sellerNet?: number;
  saleReason?: string;
  internalNotes?: string;
  locationNow?: string;
  submissionId?: string;
};

export type LogLine = { text: string; at: string; tone?: "info" | "ok" | "warn" | "bad" };

export type SubmissionStatus = "new" | "follow_up" | "accepted" | "rejected";

export type Submission = {
  id: string; // «#1024»
  createdAt: string; // display, e.g. «النهارده 10:40 ص»
  fullName: string;
  phone: string;
  governorate: string;
  pickupAddress: string;
  lat?: number;
  lng?: number;
  deviceType: DeviceType;
  brand: string;
  details: string; // title-ish: «أوتوكلاف Class B — 18 لتر»
  year: string;
  accessories: string;
  saleReason: string;
  condition: Condition;
  wantsRepair: boolean;
  repairDescription: string;
  hasWarranty: boolean;
  warrantyRemaining: string;
  hasBox: boolean;
  repairedBefore: YesNoUnknown;
  repairedDetails: string;
  defects: string;
  keepLocation: "with_seller" | "send_to_platform";
  salePrice: number;
  sellerNet: number;
  photos: number;
  hasVideo: boolean;
  accessoryPhotos: number;
  feeStatus: "pending" | "paid" | "refunded" | "forfeited";
  feeReference: string;
  status: SubmissionStatus;
  rejectReason?: string;
  deviceId?: string; // set when accepted → draft device
  log: LogLine[];
};

export type DeviceRequest = {
  id: string; // «R-118»
  createdAt: string; // «27 أكتوبر»
  fullName: string;
  phone: string;
  governorate: string;
  deviceType: DeviceType;
  brandPref: string;
  budgetMin: number;
  budgetMax: number;
  neededBy: string;
  inspectionPref: "any" | "inspected_only";
  notes: string;
  status: "new" | "notified" | "closed";
  notifiedAt?: string;
};

export type CheckKey = "run" | "look" | "parts" | "maint";
export type CheckValue = { v: "" | "pass" | "note"; n: string };

export type Inspection = {
  id: string; // «F-297»
  deviceId?: string; // linked listing, if it exists
  title: string;
  deviceType: DeviceType;
  governorate: string;
  location: string; // «عند البايع · مدينة نصر» | «مقر الفحص»
  technician: string; // "" = needs a technician
  day: number; // 0..6 within the demo week (24–30 أكتوبر), 3 = today
  time: string;
  kind: "pre_publish" | "after_order";
  orderId?: string;
  status: "scheduled" | "needs_review" | "done";
  form: {
    checks: Record<CheckKey, CheckValue>;
    efficiency: string;
    condition: Condition | "";
    defects: string;
    photos: number;
  };
};

export type DemoState = {
  version: number;
  devices: Device[];
  submissions: Submission[];
  requests: DeviceRequest[];
  inspections: Inspection[];
  favorites: string[]; // device ids
};
