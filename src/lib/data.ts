// Seeded sample data for the demo. Bracketed values ([السعر], [السنة]…) are
// placeholders from CLAUDE.md §8 and stay null until real data exists.
import type {
  Category,
  InspectionReport,
  Listing,
  MaintenanceMonths,
  Order,
  OrderStatus,
  Seller,
} from "./types";

export const CATEGORY_LABELS: Record<Category, string> = {
  rotary: "روتاري",
  camera: "كاميرا",
  light_cure: "لايت كيور",
  loupe: "لوب",
  motor: "موتور",
};

/** Checklist templates per category (CLAUDE.md §4). */
export const CHECKLIST_TEMPLATES: Record<Category, string[]> = {
  rotary: [
    "سرعة الدوران وثباتها",
    "الصوت والاهتزاز",
    "البيرنج والتسخين أثناء الشغل",
    "السبراي — المية والهوا",
    "الإضاءة (الفايبر أوبتك)",
    "مسكة البير وثباته",
  ],
  camera: [
    "وضوح الصورة والتركيز",
    "إضاءة الـ LED وألوان الصورة",
    "زرار التصوير",
    "التوصيل بالكمبيوتر وتوافق البرنامج",
    "الكابل والجسم من غير شروخ",
    "الأغطية والإكسسوارات",
  ],
  light_cure: [
    "شدة الضوء (mW/cm²) بجهاز قياس",
    "الطول الموجي ونوع اللمبة",
    "التايمر وأوضاع التشغيل",
    "البطارية والشاحن",
    "طرف الفايبر من غير شروخ",
    "التسخين أثناء التشغيل",
  ],
  loupe: [
    "وضوح العدسات وقوة التكبير",
    "مسافة الشغل (Working distance)",
    "ضبط المسافة بين العينين",
    "الإطار والمفصلات",
    "إضاءة الـ LED والبطارية",
    "خدوش أو شروخ في العدسات",
  ],
  motor: [
    "السرعة والعزم مطابقين للإعدادات",
    "الميكروموتور — صوت واهتزاز وتسخين",
    "الكونترا والهاند بيس",
    "وحدة التحكم أو البطارية والشاحن",
    "الفوت كنترول والطلمبة",
    "الشاشة والأزرار ورسائل الأخطاء",
  ],
};

export const SELLERS: Seller[] = [
  { id: "s1", name: "[اسم الطبيب]", verifiedDentist: true, whatsapp: null },
  { id: "s2", name: "[اسم الطبيب]", verifiedDentist: true, whatsapp: null },
];

type Seed = {
  id: string;
  title: string;
  category: Category;
  inspected: boolean;
  maint: MaintenanceMonths;
  sellReason?: string;
};

const SEEDS: Seed[] = [
  { id: "implant-motor-cairo", title: "موتور جراحة وزراعة", category: "motor", inspected: true, maint: 6, sellReason: "تحديث العيادة لموديل أحدث" },
  { id: "intraoral-camera-alex", title: "كاميرا إنترا أورال", category: "camera", inspected: false, maint: 3 },
  { id: "cordless-endo-motor", title: "إندو موتور لاسلكي", category: "motor", inspected: true, maint: 3 },
  { id: "loupes-giza", title: "لوب تكبير 3.5x", category: "loupe", inspected: false, maint: 3 },
  { id: "high-speed-handpiece", title: "توربينة هاي سبيد", category: "rotary", inspected: true, maint: 3 },
  { id: "cordless-light-cure", title: "لايت كيور لاسلكي", category: "light_cure", inspected: true, maint: 3 },
  { id: "contra-angle", title: "كونترا أنجل", category: "rotary", inspected: true, maint: 3 },
  { id: "led-light-cure", title: "لايت كيور LED", category: "light_cure", inspected: false, maint: 3 },
  { id: "wireless-camera-assiut", title: "كاميرا إنترا أورال لاسلكية", category: "camera", inspected: false, maint: 6 },
  { id: "led-loupes-cairo", title: "لوب تكبير بإضاءة LED", category: "loupe", inspected: true, maint: 6 },
];

export const LISTINGS: Listing[] = SEEDS.map((s, i) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  brand: null,
  model: null,
  year: null,
  originCountry: null,
  priceEgp: null,
  fairPriceBand: null,
  inspectionState: s.inspected ? "inspected" : "inspect_on_order",
  maintenanceMonths: s.maint,
  sellerId: i % 2 === 0 ? "s1" : "s2",
  sellReason: s.sellReason ?? null,
  photos: [],
  videos: [],
  status: "active",
  // Newest first in the seed order.
  listedAt: new Date(Date.UTC(2026, 9, 18 - i)).toISOString(),
}));

function reportFor(listing: Listing): InspectionReport {
  const base = {
    id: `r-${listing.id}`,
    listingId: listing.id,
    serialNumber: null,
    date: null,
    technicianName: null,
    reviewingDentistName: null,
    replacedParts: [],
  };
  if (listing.id === "implant-motor-cairo") {
    const labels = CHECKLIST_TEMPLATES.motor;
    return {
      ...base,
      operationScore: "ممتاز",
      appearanceScore: "جيد جداً",
      checklistItems: labels.map((label, i) =>
        i === 1
          ? { label, result: "note" as const, note: "تآكل بسيط في غلاف كابل الميكروموتور (صورة مرفقة)" }
          : { label, result: "pass" as const },
      ),
      disclosedDefects: [{ description: "كابل الميكروموتور — تآكل بسيط في الغلاف" }],
    };
  }
  return {
    ...base,
    operationScore: "ممتاز",
    appearanceScore: "جيد جداً",
    checklistItems: CHECKLIST_TEMPLATES[listing.category].map((label) => ({ label, result: "pass" })),
    disclosedDefects: [],
  };
}

/** Report written at the seller's place for order 1024 (inspect_on_order). */
const CAMERA_ORDER_REPORT: InspectionReport = {
  id: "r-intraoral-camera-alex",
  listingId: "intraoral-camera-alex",
  serialNumber: null,
  date: "2026-10-14T13:00:00Z",
  technicianName: null,
  reviewingDentistName: null,
  operationScore: "ممتاز",
  appearanceScore: "جيد جداً",
  replacedParts: [],
  checklistItems: CHECKLIST_TEMPLATES.camera.map((label, i) =>
    i === 4 ? { label, result: "note", note: "[وصف الملاحظة]" } : { label, result: "pass" },
  ),
  disclosedDefects: [{ description: "الكابل والجسم — [وصف الملاحظة]" }],
  highlights: [{ label: "وضوح الصورة", value: "ممتاز" }],
};

export const REPORTS: InspectionReport[] = [
  ...LISTINGS.filter((l) => l.inspectionState === "inspected").map(reportFor),
  CAMERA_ORDER_REPORT,
];

export const ORDERS: Order[] = [
  {
    id: "1024",
    listingId: "intraoral-camera-alex",
    buyerId: "b1",
    amountEgp: null,
    status: "report_sent_awaiting_buyer",
    timestamps: {
      paid_in_escrow: "2026-10-12T10:00:00Z",
      inspection_at_seller: "2026-10-14T13:00:00Z",
      report_sent_awaiting_buyer: "2026-10-16T09:30:00Z",
    },
    warrantyStartDate: null,
  },
];

export function getListing(id: string) {
  return LISTINGS.find((l) => l.id === id);
}

export function getReport(listingId: string) {
  return REPORTS.find((r) => r.listingId === listingId);
}

export function getSeller(id: string) {
  return SELLERS.find((s) => s.id === id);
}

export function getOrder(id: string) {
  return ORDERS.find((o) => o.id === id);
}

/** The happy-path steps for an order (CLAUDE.md §3). */
export function orderSteps(state: Listing["inspectionState"]): OrderStatus[] {
  const steps: OrderStatus[] = [
    "paid_in_escrow",
    "inspection_at_seller",
    "report_sent_awaiting_buyer",
    "shipping",
    "delivered",
    "trial_period",
    "released_to_seller",
  ];
  return state === "inspected"
    ? steps.filter((s) => s !== "inspection_at_seller" && s !== "report_sent_awaiting_buyer")
    : steps;
}

/** Static copy per order step; the tracker fills in details that depend on the report or listing. */
export const ORDER_STEP_LABELS: Record<OrderStatus, { title: string; detail: string }> = {
  paid_in_escrow: { title: "الدفع اتحفظ عندنا", detail: "فلوسك في أمان، ومش هتتحول للبايع غير بعد تأكيدك." },
  inspection_at_seller: { title: "فحص الجهاز عند البايع", detail: "فني بيفحص الجهاز ودكتور أسنان بيراجع التقرير." },
  report_sent_awaiting_buyer: { title: "تقرير الفحص وصلك", detail: "راجع التقرير وأكّد علشان نشحن." },
  shipping: { title: "الشحن", detail: "شحن مؤمَّن لحد باب العيادة" },
  delivered: { title: "الاستلام والتركيب", detail: "تستلم الجهاز وتتأكد إنه زي التقرير" },
  trial_period: { title: "فترة التجربة — 14 يوم", detail: "ضمان تشغيل، واستبدال أو استرجاع لو فيه مشكلة" },
  released_to_seller: { title: "تحويل المبلغ للبايع", detail: "بعد ما فترة التجربة تخلص من غير مشاكل" },
  cancelled_refunded: { title: "الطلب اتلغى وفلوسك رجعت", detail: "المبلغ رجعلك كامل." },
  returned: { title: "الجهاز اترجع", detail: "المبلغ رجعلك." },
  replaced: { title: "الجهاز اتبدل", detail: "وصلك جهاز بديل." },
};

/** Status pill text for the order header. */
export const ORDER_STATUS_PILL: Record<OrderStatus, string> = {
  paid_in_escrow: "الدفع اتحفظ — بنجهّز الفحص",
  inspection_at_seller: "الجهاز بيتفحص عند البايع",
  report_sent_awaiting_buyer: "مستني تأكيدك على تقرير الفحص",
  shipping: "الجهاز في الطريق لعيادتك",
  delivered: "الجهاز وصل",
  trial_period: "فترة التجربة شغالة",
  released_to_seller: "الطلب خلص",
  cancelled_refunded: "الطلب اتلغى وفلوسك رجعت",
  returned: "الجهاز اترجع",
  replaced: "الجهاز اتبدل",
};
