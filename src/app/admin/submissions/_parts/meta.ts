// Visual maps from Admin-Submissions.dc.html keyed by the store's values.
import { typeLabel } from "@/lib/demo/labels";
import type { LogLine, Submission, SubmissionStatus } from "@/lib/demo/types";

export const ST: Record<SubmissionStatus, { l: string; bg: string; fg: string }> = {
  new: { l: "جديد", bg: "#E6EDF7", fg: "#24508F" },
  follow_up: { l: "محتاج متابعة", bg: "#FBEEDC", fg: "#8A4209" },
  accepted: { l: "اتقبل", bg: "#EAF5DD", fg: "#3F7A1F" },
  rejected: { l: "اترفض", bg: "#FBE9E7", fg: "#B3261E" },
};

export const TABS: [SubmissionStatus, string][] = [
  ["new", "جديد"],
  ["follow_up", "محتاج متابعة"],
  ["accepted", "اتقبل"],
  ["rejected", "اترفض"],
];

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
};

export const PHOTO_REQS: [string, string][] = [
  ["plate", "صورة اللوحة والسيريال"],
  ["sides", "صور من كل الجهات"],
  ["close", "صور قريبة للعيوب"],
  ["video", "فيديو وهو شغال"],
];

export const REJECT_REASONS = [
  "السعر بعيد عن السوق لحالة الجهاز",
  "الصور مش كفاية ومفيش رد",
  "الجهاز مش من التصنيفات اللي بنعرضها",
  "حالة الجهاز أقل من المطلوب",
  "سبب تاني",
];

export const SLOTS = ["الصبح (10 – 1)", "بعد الضهر (1 – 5)", "بالليل (5 – 8)"];
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
  !q || `${s.id} ${s.details} ${typeLabel(s.deviceType)} ${s.governorate}`.toLowerCase().indexOf(q) >= 0;
