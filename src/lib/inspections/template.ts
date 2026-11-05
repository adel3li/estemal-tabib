// Inspection checklist (client, 5 Nov 2026): one default template for every
// device — editable from «الإعدادات» (site_settings.inspection_template) — and
// each inspection can add or remove items of its own.
import type { CheckItem } from "@/lib/demo/types";

type Hint = { sub: string; ph: string };

/** The built-in template (used until «الإعدادات» saves another one). */
export const BUILTIN_TEMPLATE = ["التشغيل", "الحالة الظاهرية", "الأجزاء المتغيرة", "الصيانة السابقة"];

/** Built-in items keep their old keys, so reports / older rows still match. */
const BUILTIN_KEYS: Record<string, string> = { التشغيل: "run", "الحالة الظاهرية": "look", "الأجزاء المتغيرة": "parts", "الصيانة السابقة": "maint" };

/** Helper text under the built-in items. */
const HINTS: Record<string, Hint> = {
  التشغيل: { sub: "الجهاز اشتغل واتجرب على كل الوظايف", ph: "مثال: الضغط بيقع بعد 10 دقايق" },
  "الحالة الظاهرية": { sub: "الجسم، الشاشة، الكابلات، الكسور", ph: "مثال: خدش في الغطا" },
  "الأجزاء المتغيرة": { sub: "أي قطعة مش أصلية أو اتغيرت", ph: "مثال: الهاند بيس اتغير 2024" },
  "الصيانة السابقة": { sub: "آخر صيانة ومين عملها", ph: "مثال: صيانة توكيل من 6 شهور" },
};
export const hintFor = (label: string): Hint => HINTS[label.trim()] ?? { sub: "", ph: "اكتب الملاحظة" };

let current: string[] = BUILTIN_TEMPLATE;

/** Called when site_settings loads / is saved. */
export function setTemplate(labels: string[] | null | undefined) {
  const clean = (labels ?? []).map((l) => String(l).trim()).filter(Boolean);
  current = clean.length ? clean : BUILTIN_TEMPLATE;
}
export const currentTemplate = () => current;

/** A key for a label: the old key for built-in items, otherwise a fresh one. */
export const keyFor = (label: string) => BUILTIN_KEYS[label.trim()] ?? `c-${Math.random().toString(36).slice(2, 8)}`;

/** Empty checklist from the current default template. */
export const emptyChecks = (labels: string[] = current): CheckItem[] => labels.map((label) => ({ key: keyFor(label), label, v: "", n: "" }));

/** The item for a role the report needs («الحالة الظاهرية», «الأجزاء المتغيرة»). */
export const findCheck = (items: CheckItem[], key: "look" | "parts") => items.find((c) => c.key === key);
