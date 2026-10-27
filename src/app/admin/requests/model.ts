import { CONDITIONS, INSPECTION_LABEL, fmt, typeLabel } from "@/lib/demo/labels";
import type { Device, DeviceRequest } from "@/lib/demo/types";

export type ReqStatus = DeviceRequest["status"];
export const ST: Record<ReqStatus, [string, string, string]> = {
  new: ["جديد", "#FBEEDC", "#8A4209"],
  notified: ["اتبلّغ", "#E6EDF7", "#24508F"],
  closed: ["مقفول", "#E5EBE8", "#4A5A56"],
};
export const TABS: [ReqStatus, string][] = [["new", "جديد"], ["notified", "اتبلّغ"], ["closed", "مقفول"]];
export const TODAY = "27 أكتوبر";

export const prefOf = (r: DeviceRequest): [string, string, string] =>
  r.inspectionPref === "inspected_only" ? ["ما تم فحصه فقط", "#E3F0ED", "#0D5C55"] : ["أي حالة", "#F5F7F4", "#3C4C48"];

export const budgetTxt = (r: DeviceRequest) => `${fmt(r.budgetMin)} – ${fmt(r.budgetMax)}`;

export const condTxt = (d: Device) =>
  CONDITIONS[d.condition].short === CONDITIONS[d.condition].range
    ? CONDITIONS[d.condition].short
    : `${CONDITIONS[d.condition].short} ${CONDITIONS[d.condition].range}`;

/** WhatsApp message; `link` turns a device id into a public URL (omitted in the preview). */
export function waMessage(r: DeviceRequest, m: Device[], link?: (id: string) => string): string {
  const lines = m.map(
    (d) => `• ${d.title} — ${fmt(d.price)} ج.م (${INSPECTION_LABEL[d.inspection]})${link ? `\n${link(d.id)}` : ""}`,
  );
  return (
    `أهلاً ${r.fullName}، معاك استعمال طبيب بخصوص طلبك (${typeLabel(r.deviceType)}).\n` +
    `لقينا ${m.length} ${m.length === 1 ? "جهاز مطابق" : "أجهزة مطابقة"} لطلبك:\n` +
    `${lines.join("\n")}\nمن طبيب لطبيب... بثقة.`
  );
}
