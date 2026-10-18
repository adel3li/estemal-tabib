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
  unit: "يونيت",
  xray: "أشعة",
  sterilization: "تعقيم",
  endo_surgery: "إندو وجراحة",
  instruments: "أدوات",
};

/** Checklist templates per category (CLAUDE.md §4). */
export const CHECKLIST_TEMPLATES: Record<Category, string[]> = {
  unit: [
    "الكرسي والهيدروليك — طلوع ونزول وميل بدون صوت أو تسريب",
    "خطوط التوربينة والميكروموتور — ضغط الهوا والمية",
    "كشاف الإضاءة",
    "الشفاط والسبيتون",
    "الفوت كنترول وكرسي الطبيب",
    "جلد مسند الراس والتنجيد",
  ],
  sterilization: [
    "الحجرة والجوان — تسريب أو تآكل",
    "الضغط والحرارة في كل دورة",
    "اختبار Bowie-Dick واختبار Helix",
    "طلمبة الفاكيوم والفلاتر",
    "الحساسات والشاشة ورسائل الأخطاء",
    "سجل الصيانة والقطع اللي اتغيرت",
  ],
  xray: [
    "التيوب ووقت التعريض — ثبات الـ kV والـ mA",
    "الذراع والمفاصل — ثبات بدون اهتزاز",
    "جودة الصورة على فانتوم اختبار",
    "التايمر وزرار التشغيل",
    "الحساس أو الكابل وتوافق البرنامج (RVG)",
    "سجل الصيانة والقطع اللي اتغيرت",
  ],
  endo_surgery: [
    "الموتور — السرعة والعزم مطابقين للإعدادات",
    "الهاند بيس والكونترا — صوت واهتزاز",
    "البطارية والشاحن",
    "دقة القياس (أبيكس لوكيتور) أو شدة الضوء (لايت كيور)",
    "الشاشة والأزرار ورسائل الأخطاء",
    "الإكسسوارات الأصلية والكابلات",
  ],
  instruments: [
    "الحالة الظاهرية والتآكل",
    "الحواف والسنون",
    "المفاصل والحركة",
    "قابلية التعقيم",
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
  governorate: string;
  maint: MaintenanceMonths;
  sellReason?: string;
};

const SEEDS: Seed[] = [
  { id: "dental-unit-cairo", title: "يونيت أسنان كامل", category: "unit", inspected: true, governorate: "القاهرة", maint: 6, sellReason: "تحديث العيادة لموديل أحدث" },
  { id: "autoclave-class-b-alex", title: "أوتوكلاف Class B", category: "sterilization", inspected: false, governorate: "الإسكندرية", maint: 3 },
  { id: "cordless-endo-motor", title: "إندو موتور لاسلكي", category: "endo_surgery", inspected: true, governorate: "المنصورة", maint: 3 },
  { id: "wall-xray-giza", title: "جهاز أشعة X-Ray حائطي", category: "xray", inspected: false, governorate: "الجيزة", maint: 6 },
  { id: "apex-locator", title: "أبيكس لوكيتور", category: "endo_surgery", inspected: true, governorate: "القاهرة", maint: 3 },
  { id: "rvg-sensor", title: "حساس أشعة رقمي RVG", category: "xray", inspected: true, governorate: "الإسكندرية", maint: 6 },
  { id: "surgery-implant-motor", title: "موتور جراحة وزراعة", category: "endo_surgery", inspected: true, governorate: "القاهرة", maint: 6 },
  { id: "led-light-cure", title: "لايت كيور LED", category: "endo_surgery", inspected: false, governorate: "طنطا", maint: 3 },
  { id: "dental-unit-assiut", title: "يونيت أسنان", category: "unit", inspected: false, governorate: "أسيوط", maint: 6 },
  { id: "ultrasonic-cleaner", title: "جهاز تنظيف بالموجات Ultrasonic", category: "sterilization", inspected: true, governorate: "الجيزة", maint: 3 },
];

export const LISTINGS: Listing[] = SEEDS.map((s, i) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  brand: null,
  model: null,
  year: null,
  originCountry: null,
  governorate: s.governorate,
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
  if (listing.id === "dental-unit-cairo") {
    const labels = CHECKLIST_TEMPLATES.unit;
    return {
      ...base,
      operationScore: "ممتاز",
      appearanceScore: "جيد جداً",
      checklistItems: [
        ...labels.slice(0, 5).map((label) => ({ label, result: "pass" as const })),
        { label: "جلد مسند الراس", result: "note", note: "تآكل بسيط في الطرف (صورة مرفقة)" },
      ],
      disclosedDefects: [{ description: "جلد مسند الراس — تآكل بسيط في الطرف" }],
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

export const REPORTS: InspectionReport[] = LISTINGS.filter((l) => l.inspectionState === "inspected").map(reportFor);

export const ORDERS: Order[] = [
  {
    id: "1024",
    listingId: "autoclave-class-b-alex",
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

export const ORDER_STEP_LABELS: Record<OrderStatus, { title: string; detail: string }> = {
  paid_in_escrow: { title: "دفعت، والفلوس محفوظة عندنا", detail: "المبلغ عندنا ومش هيتحول للبايع غير بعد تأكيدك." },
  inspection_at_seller: { title: "فحص الجهاز عند البايع", detail: "الفني بيفحص الجهاز ودكتور أسنان بيراجع التقرير." },
  report_sent_awaiting_buyer: { title: "تقرير الفحص وصلك", detail: "راجع التقرير، وأكّد الشحن أو الغي الطلب وفلوسك ترجعلك كاملة." },
  shipping: { title: "الجهاز في الطريق لعيادتك", detail: "شحن آمن لحد باب العيادة." },
  delivered: { title: "استلمت الجهاز", detail: "الضمان بيبدأ من يوم الاستلام." },
  trial_period: { title: "فترة التجربة — 14 يوم", detail: "جرّب الجهاز على حالات حقيقية. لو فيه مشكلة: استبدال أو استرجاع." },
  released_to_seller: { title: "الفلوس اتحولت للبايع", detail: "بعد تأكيدك. والصيانة مستمرة حسب مدة الجهاز." },
  cancelled_refunded: { title: "الطلب اتلغى وفلوسك رجعت", detail: "المبلغ رجعلك كامل." },
  returned: { title: "الجهاز اترجع", detail: "المبلغ رجعلك." },
  replaced: { title: "الجهاز اتبدل", detail: "وصلك جهاز بديل." },
};
