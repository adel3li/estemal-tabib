"use client";

// Inspections ⇄ Supabase (control panel step 4). Admins only. The page keeps
// the demo `Inspection` shape; `day` (0..6 in the week list) is derived from
// scheduled_at around today.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckKey, Condition, DeviceType, Inspection } from "@/lib/demo/types";

type Check = { key: CheckKey; label?: string; group?: string; ok: boolean; v?: "" | "pass" | "note"; note?: string | null };
type Row = {
  id: string;
  public_code: string;
  device_id: string | null;
  submission_id: string | null;
  order_id: string | null;
  kind: Inspection["kind"];
  title: string | null;
  location: string | null;
  technician_name: string | null;
  scheduled_at: string | null;
  status: "needs_tech" | "scheduled" | "late" | "needs_review" | "done";
  checklist: Check[];
  overall_efficiency: string | null;
  condition: Condition | null;
  defects: string | null;
  device_type: DeviceType | null;
  governorate: string | null;
  time_slot: string | null;
  photo_count: number;
  device: { public_code: string } | null;
  submission: { public_code: string } | null;
  order: { public_code: string } | null;
};

const COLUMNS =
  "id, public_code, device_id, submission_id, order_id, kind, title, location, technician_name, scheduled_at, status, checklist, overall_efficiency, condition, defects, device_type, governorate, time_slot, photo_count, device:devices(public_code), submission:seller_submissions(public_code), order:orders(public_code)";

const KEYS: CheckKey[] = ["run", "look", "parts", "maint"];
const DAY = 86_400_000;

/** Start of the Cairo day containing `t`. */
function cairoDayStart(t: number): number {
  const ymd = new Date(t).toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" }); // yyyy-mm-dd
  // Cairo is UTC+2/+3; noon UTC on that date is always the same Cairo day.
  const noon = Date.parse(`${ymd}T12:00:00Z`);
  const hour = Number(new Date(noon).toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Africa/Cairo" }));
  return noon - hour * 3_600_000;
}

/** Index in the week list: today = 3, clamped to 0..6. */
export function dayIndex(iso: string | undefined, now = Date.now()): number {
  if (!iso) return 3;
  const d = Math.round((cairoDayStart(Date.parse(iso)) - cairoDayStart(now)) / DAY);
  return Math.max(0, Math.min(6, d + 3));
}

/** Before today (Cairo)? */
export const isPastDay = (iso: string | undefined, now = Date.now()) => !!iso && Date.parse(iso) < cairoDayStart(now);

/** The 7 days shown: [weekday, day of month] for today−3 … today+3. */
export function weekDays(now = Date.now()): [string, string][] {
  return Array.from({ length: 7 }, (_, i) => {
    const t = cairoDayStart(now) + (i - 3) * DAY + 12 * 3_600_000;
    const wd = new Date(t).toLocaleDateString("ar-EG", { weekday: "long", timeZone: "Africa/Cairo" });
    const dm = new Date(t).toLocaleDateString("ar-EG", { day: "numeric", timeZone: "Africa/Cairo" });
    return [wd, dm];
  });
}

export const dateLabelOf = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Cairo" });

/** yyyy-mm-dd + slot → ISO at the slot's start hour (Cairo). */
export function scheduledIso(date: string, slot: string): string {
  const h = /10/.test(slot) ? 10 : /\(1 /.test(slot) || /بعد الضهر/.test(slot) ? 13 : /بالليل/.test(slot) ? 17 : 10;
  const base = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
  const start = cairoDayStart(Date.parse(`${base}T12:00:00Z`));
  return new Date(start + h * 3_600_000).toISOString();
}

function fromRow(r: Row): Inspection {
  const byKey = new Map((r.checklist ?? []).map((c) => [c.key, c]));
  const checks = Object.fromEntries(
    KEYS.map((k) => {
      const c = byKey.get(k);
      return [k, { v: c ? (c.v ?? (c.ok ? "pass" : "note")) : "", n: c?.note ?? "" }];
    }),
  ) as Inspection["form"]["checks"];
  return {
    dbId: r.id,
    id: r.public_code,
    scheduledAt: r.scheduled_at ?? undefined,
    dateLabel: r.scheduled_at ? dateLabelOf(r.scheduled_at) : undefined,
    submissionId: r.submission?.public_code,
    deviceId: r.device?.public_code,
    orderId: r.order?.public_code,
    title: r.title ?? "",
    deviceType: r.device_type ?? "other",
    governorate: r.governorate ?? "",
    location: r.location ?? "مقر الفحص",
    technician: r.technician_name ?? "",
    day: dayIndex(r.scheduled_at ?? undefined),
    time: r.time_slot ?? "",
    kind: r.kind,
    status: r.status === "done" ? "done" : r.status === "needs_review" ? "needs_review" : "scheduled",
    form: {
      checks,
      efficiency: r.overall_efficiency ?? "",
      condition: r.condition ?? "",
      defects: r.defects ?? "",
      photos: r.photo_count ?? 0,
    },
  };
}

export async function fetchInspections(sb: SupabaseClient): Promise<Inspection[]> {
  const { data, error } = await sb.from("inspections").select(COLUMNS).order("scheduled_at", { ascending: true });
  if (error) throw error;
  return (data as unknown as Row[]).map(fromRow);
}

const LABELS: Record<CheckKey, string> = { run: "التشغيل", look: "الحالة الظاهرية", parts: "الأجزاء المتغيرة", maint: "الصيانة السابقة" };

/** Row written for an inspection. Linked ids are resolved by the store (undefined = not saved yet). */
export function inspectionRow(i: Inspection, links: { deviceDbId?: string; submissionDbId?: string; orderDbId?: string }) {
  return {
    public_code: i.id,
    device_id: links.deviceDbId ?? null,
    submission_id: links.submissionDbId ?? null,
    order_id: links.orderDbId ?? null,
    kind: i.kind,
    title: i.title,
    location: i.location,
    technician_name: i.technician || null,
    scheduled_at: i.scheduledAt ?? null,
    status: i.status === "done" ? "done" : i.status === "needs_review" ? "needs_review" : i.technician ? "scheduled" : "needs_tech",
    checklist: KEYS.filter((k) => i.form.checks[k].v).map((k) => ({
      key: k,
      label: LABELS[k],
      group: "core",
      ok: i.form.checks[k].v === "pass",
      v: i.form.checks[k].v,
      note: i.form.checks[k].n || null,
    })),
    overall_efficiency: i.form.efficiency || null,
    condition: i.form.condition || null,
    defects: i.form.defects || null,
    device_type: i.deviceType,
    governorate: i.governorate || null,
    time_slot: i.time || null,
    photo_count: i.form.photos,
  };
}

/** Insert (no dbId) or update. Returns the database id. */
export async function saveInspection(sb: SupabaseClient, dbId: string | undefined, row: ReturnType<typeof inspectionRow>, approvedBy?: string): Promise<string> {
  const extra = row.status === "done" && approvedBy ? { approved_by: approvedBy, approved_at: new Date().toISOString() } : {};
  if (!dbId) {
    const { data, error } = await sb.from("inspections").insert({ ...row, ...extra }).select("id").single();
    if (error) throw error;
    return data.id as string;
  }
  const { error } = await sb.from("inspections").update({ ...row, ...extra }).eq("id", dbId);
  if (error) throw error;
  return dbId;
}
