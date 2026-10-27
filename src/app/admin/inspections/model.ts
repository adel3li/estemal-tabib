import { CONDITIONS } from "@/lib/demo/labels";
import type { CheckKey, Condition, Inspection } from "@/lib/demo/types";

export const TODAY = 3;
export const DAYS: [string, string][] = [
  ["السبت", "٢٤"], ["الحد", "٢٥"], ["الاتنين", "٢٦"], ["الثلاثاء", "٢٧"], ["الأربع", "٢٨"], ["الخميس", "٢٩"], ["الجمعة", "٣٠"],
];
export const TECHS = ["[اسم الفني ١]", "[اسم الفني ٢]", "[اسم الفني ٣]"];

export const CHECKS: { key: CheckKey; label: string; sub: string; ph: string }[] = [
  { key: "run", label: "التشغيل", sub: "الجهاز اشتغل واتجرب على كل الوظايف", ph: "مثال: الضغط بيقع بعد 10 دقايق" },
  { key: "look", label: "الحالة الظاهرية", sub: "الجسم، الشاشة، الكابلات، الكسور", ph: "مثال: خدش في الغطا" },
  { key: "parts", label: "الأجزاء المتغيرة", sub: "أي قطعة مش أصلية أو اتغيرت", ph: "مثال: الهاند بيس اتغير 2024" },
  { key: "maint", label: "الصيانة السابقة", sub: "آخر صيانة ومين عملها", ph: "مثال: صيانة توكيل من 6 شهور" },
];

/** Design label for a store condition: «ممتازة 81–100%», «جيدة 60–80%», «أقل من 60%». */
export const condLabel = (c: Condition) =>
  CONDITIONS[c].short === CONDITIONS[c].range ? CONDITIONS[c].short : `${CONDITIONS[c].short} ${CONDITIONS[c].range}`;

export type St = "sched" | "notech" | "late" | "review" | "pub";
export const ST: Record<St, [string, string, string]> = {
  sched: ["مجدول", "#E6EDF7", "#24508F"],
  notech: ["محتاج فني", "#FBEEDC", "#8A4209"],
  late: ["متأخر", "#FBE9E7", "#B3261E"],
  review: ["التقرير محتاج مراجعة", "#FBEEDC", "#8A4209"],
  pub: ["تم الفحص", "#EAF5DD", "#3F7A1F"],
};

export function statusOf(it: Inspection): St {
  if (it.status === "done") return "pub";
  if (it.status === "needs_review") return "review";
  if (it.day < TODAY) return "late";
  if (!it.technician) return "notech";
  return "sched";
}

export type Tab = "all" | "today" | "late" | "review" | "pub";
export const TABS: [Tab, string][] = [["all", "الكل"], ["today", "النهارده"], ["late", "متأخر"], ["review", "محتاج مراجعة"], ["pub", "تم الفحص"]];

export function inTab(it: Inspection, tab: Tab): boolean {
  const st = statusOf(it);
  if (tab === "today") return it.day === TODAY && st !== "pub";
  if (tab === "late") return st === "late";
  if (tab === "review") return st === "review";
  if (tab === "pub") return st === "pub";
  return true;
}

export const isBuyer = (it: Inspection) => it.kind === "after_order";
export const typePill = (it: Inspection): [string, string, string] =>
  isBuyer(it) ? ["بعد طلب مشتري", "#E6EDF7", "#24508F"] : ["قبل النشر", "#F5F7F4", "#3C4C48"];

export type Form = Inspection["form"];

export function missing(it: Inspection, f: Form): string[] {
  const m: string[] = [];
  if (!it.technician) m.push("تحديد الفني");
  CHECKS.forEach((c) => {
    const r = f.checks[c.key];
    if (!r.v) m.push(`بند «${c.label}»`);
    else if (r.v === "note" && !r.n.trim()) m.push(`ملاحظة «${c.label}»`);
  });
  if (!f.efficiency) m.push("كفاءة التشغيل");
  if (!f.condition) m.push("حالة المنتج");
  if (!f.photos) m.push("صور الفحص");
  return m;
}

export type Toast = { kind: "ok" | "info"; txt: string; deviceId?: string };
export const TK = { ok: ["#EAF5DD", "#B9DCA4", "#3F7A1F", "✓"], info: ["#E6EDF7", "#B8C9E4", "#24508F", "i"] } as const;
