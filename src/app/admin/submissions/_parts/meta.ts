// Visual maps from Admin-Submissions.dc.html keyed by the store's values.
import { VIDEO_ENABLED } from "@/config/features";
import { typeLabel } from "@/lib/demo/labels";
import { matchesSearch } from "@/lib/search";
import type { LogLine, Submission, SubmissionStatus } from "@/lib/demo/types";

export const ST: Record<SubmissionStatus, { l: string; bg: string; fg: string }> = {
  new: { l: "جديد", bg: "#E6EDF7", fg: "#24508F" },
  follow_up: { l: "محتاج متابعة", bg: "#FBEEDC", fg: "#8A4209" },
  accepted: { l: "اتقبل", bg: "#EAF5DD", fg: "#3F7A1F" },
  rejected: { l: "اترفض", bg: "#FBE9E7", fg: "#B3261E" },
};

/** List tabs: the 4 statuses + «مشبوه» (requests from accounts flagged suspicious, ADMIN_SPEC §7). */
export type Tab = SubmissionStatus | "spam";
export const TABS: [Tab, string][] = [
  ["new", "جديد"],
  ["follow_up", "محتاج متابعة"],
  ["accepted", "اتقبل"],
  ["rejected", "اترفض"],
  ["spam", "مشبوه"],
];
export const inTab = (s: Submission, t: Tab) =>
  t === "spam" ? s.sellerTrust === "suspicious" : s.sellerTrust !== "suspicious" && s.status === t;

export const DOT: Record<NonNullable<LogLine["tone"]>, string> = {
  info: "#24508F",
  ok: "#3F7A1F",
  warn: "#F2A33A",
  bad: "#B3261E",
};

export const FEE: Record<Submission["feeStatus"], { short: string; txt: string; bg: string; fg: string }> = {
  pending: { short: "رسوم الجدية ✕", txt: "لسه متدفعتش", bg: "#FBEEDC", fg: "#8A4209" },
  paid: { short: "رسوم الجدية ✓", txt: "اتدفعت ✓", bg: "#EAF5DD", fg: "#3F7A1F" },
  refunded: { short: "رسوم الجدية اترجعت", txt: "اترجعت للبايع", bg: "#E6EDF7", fg: "#24508F" },
  forfeited: { short: "رسوم الجدية اتخصمت", txt: "اتخصمت (حسب الشروط)", bg: "#FBE9E7", fg: "#B3261E" },
  waived: { short: "من غير رسوم", txt: "مفيش رسوم (الجهاز عندنا)", bg: "#E3F0ED", fg: "#0D5C55" },
};

export const PHOTO_REQS: [string, string][] = [
  ["plate", "صورة اللوحة والسيريال"],
  ["sides", "صور من كل الجهات"],
  ["close", "صور قريبة للعيوب"],
  ...(VIDEO_ENABLED ? ([["video", "فيديو وهو شغال"]] as [string, string][]) : []),
];

// Instant-rejection reasons from the client (ADMIN_SPEC §2) + price, the main review point.
export const REJECT_REASONS = [
  "السعر مش منطقي بالنسبة للسوق",
  "الجهاز خارج التصنيفات اللي بنعرضها",
  "جهاز مسروق أو مشبوه",
  "الجهاز تالف والبايع رافض يصلحه",
  "الوصف مش مطابق للجهاز",
  "تواصل ضعيف أو متأخر من البايع",
  "سبب تاني",
];
export const NO_REPLY_REASON = "مفيش رد من البايع";

export const FEE_METHODS: [string, string][] = [
  ["instapay", "InstaPay"],
  ["vodafone_cash", "فودافون كاش"],
];

export const SLOTS = ["الصبح (10 – 1)", "بعد الضهر (1 – 5)", "بالليل (5 – 8)"];
/** Inspection happens only at headquarters (ADMIN_SPEC §4). */
export const HQ = "مقر الفحص";
export const TECHS = ["[اسم الفني المعتمد]", "[فني معتمد تاني]"];

/** Transforms that make the repeated drawing look like different photos (from the design). */
export const THUMB_TF = [
  "none",
  "scaleX(-1)",
  "scale(1.35) translate(8px, 4px)",
  "scale(1.6) translate(-10px, -6px)",
  "scale(1.25) translate(-14px, 6px)",
  "scaleX(-1) scale(1.3)",
  "scale(1.8) translate(6px, -4px)",
  "scale(1.4) translate(10px, 8px)",
];

export const matches = (s: Submission, q: string) =>
  matchesSearch(q, [s.id, s.details, typeLabel(s.deviceType), s.governorate, s.fullName, s.deviceId], [s.phone]);
