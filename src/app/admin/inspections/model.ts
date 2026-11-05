import { CONDITIONS } from "@/lib/demo/labels";
import type { Condition, Inspection } from "@/lib/demo/types";
import { isPastDay } from "@/lib/inspections/db";

/** Week list: today−3 … today+3 (see lib/inspections/db weekDays). */
export const TODAY = 3;
// Technicians have no accounts (ADMIN_SPEC §1); their names go here once the client sends them.
export const TECHS = ["[اسم الفني ١]", "[اسم الفني ٢]", "[اسم الفني ٣]"];


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
  if (isPastDay(it.scheduledAt)) return "late";
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
  if (!f.checks.length) m.push("بند فحص واحد على الأقل");
  f.checks.forEach((c) => {
    if (!c.v) m.push(`بند «${c.label}»`);
    else if (c.v === "note" && !c.n.trim()) m.push(`ملاحظة «${c.label}»`);
  });
  if (!f.efficiency) m.push("كفاءة التشغيل");
  if (!f.condition) m.push("حالة المنتج");
  if (!f.photos) m.push("صور الفحص");
  return m;
}

export type Toast = { kind: "ok" | "info"; txt: string; deviceId?: string };
export const TK = { ok: ["#EAF5DD", "#B9DCA4", "#3F7A1F", "✓"], info: ["#E6EDF7", "#B8C9E4", "#24508F", "i"] } as const;
