import { BUSINESS } from "@/config/business";
import { STEP_RELEASED, type Order } from "@/lib/demo/orders";

/** Buyer-facing description under each canonical step (§11). [done/current, upcoming] */
export const STEP_TEXT: [string, string][] = [
  ["طلبك وصلنا واتأكد. · [التاريخ]", "بنأكد الطلب مع البايع"],
  ["فلوسك في أمان، ومش هتتحول للبايع غير بعد تأكيدك. · [التاريخ]", "فلوسك بتتحفظ عندنا، مش عند البايع"],
  ["فحص بواسطة فني معتمد [الاسم] · [التاريخ]", "فني معتمد بيفحص الجهاز قبل الشحن"],
  ["الجهاز مطابق للإعلان مع ملاحظة واحدة مُعلنة. راجع التقرير وأكّد علشان نشحن.", "بيوصلك تقرير الفحص، تراجعه وتأكد قبل الشحن"],
  ["شحن مؤمَّن لحد بابك، وتعاين الجهاز بنفسك", "شحن مؤمَّن لحد بابك، وتعاين الجهاز بنفسك"],
  ["تستلم الجهاز وتتأكد إنه زي التقرير", "تستلم الجهاز وتتأكد إنه زي التقرير"],
  ["ضمان تشغيل، واستبدال أو استرجاع لو فيه مشكلة", "ضمان تشغيل، واستبدال أو استرجاع لو فيه مشكلة"],
];

export const STATUS_PILL = [
  "طلبك اتأكد",
  "فلوسك محفوظة عندنا",
  "الجهاز بيتفحص دلوقتي",
  "مستني تأكيدك على تقرير الفحص",
  "الجهاز في الطريق ليك",
  "مستنيين تأكيد استلامك",
  `في فترة التجربة (${BUSINESS.trialDays} أيام)`,
];

export function pillOf(o: Order): { txt: string; bg: string; bd: string; fg: string; dot: string } {
  if (o.status !== "active") return { txt: "الطلب اتلغى · فلوسك راجعة كاملة", bg: "#FBE9E7", bd: "#E8B4AE", fg: "#B3261E", dot: "#B3261E" };
  if (o.step >= STEP_RELEASED) return { txt: "اتحوّل للبايع · الطلب خلص", bg: "#EAF5DD", bd: "#B9DCA4", fg: "#3F7A1F", dot: "#3F7A1F" };
  return { txt: STATUS_PILL[o.step], bg: "#FDF0DD", bd: "#F0C88A", fg: "#8A4209", dot: "#F2A33A" };
}
