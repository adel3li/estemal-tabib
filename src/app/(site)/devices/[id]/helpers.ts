import type { Condition, Device, YesNoUnknown } from "@/lib/demo/types";
import { typeLabel } from "@/lib/demo/labels";

export const svgProps = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** «[الماركة / الموديل]» while both are placeholders (as in the design), else «Brand / Model». */
export function brandModel(d: Device): string {
  const ph = (x: string) => x.startsWith("[");
  if (d.capacity) {
    if (ph(d.brand) && ph(d.capacity)) return "[الماركة / السعة]";
    return `${d.brand} / ${d.capacity} لتر`;
  }
  if (ph(d.brand) && ph(d.model)) return "[الماركة / الموديل]";
  return [d.brand, d.model].filter(Boolean).join(" / ");
}

export const REPAIRED: Record<YesNoUnknown, string> = { yes: "أيوه", no: "لا", unknown: "مش عارف" };

export const COND_TILE: Record<Condition, { text: string; bg: string; lab: string; fg: string }> = {
  a: { text: "ممتازة · 81% – 100%", bg: "#EAF5DD", lab: "#3F7A1F", fg: "#2F5A15" },
  b: { text: "جيدة · 60% – 80%", bg: "#F5F7F4", lab: "#4A5A56", fg: "#12221F" },
  c: { text: "أقل من 60% · محتاج صيانة", bg: "#FBEEDC", lab: "#6B3A10", fg: "#8A4209" },
};

export function orderMessage(d: Device): string {
  return `أهلاً، عايز أطلب الجهاز ده من «استعمال طبيب»:\n${d.title} — ${typeLabel(d.type)}\nكود الجهاز: ${d.id}`;
}

export function askMessage(d: Device): string {
  return `أهلاً، عندي سؤال عن الجهاز ده:\n${d.title}\nكود الجهاز: ${d.id}`;
}

/** Defect text shown on the gallery's defect slide / count in the tiles. */
export function defectInfo(d: Device): { count: number; caption: string } {
  const r = d.report;
  if (r) {
    const row = r.checklist.find((c) => c.result !== "pass");
    const caption = row ? (row.note ? `${row.label} — ${row.note}` : row.label) : r.defects[0] ?? "";
    return { count: r.defects.length, caption };
  }
  const t = d.declaredDefects.trim();
  return { count: t ? 1 : 0, caption: t };
}
