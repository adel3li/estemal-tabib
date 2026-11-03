"use client";

// Devices ⇄ Supabase (Step 4). The app keeps using the `Device` shape from the
// demo types; these helpers map it to the §7 tables:
//   devices (public columns) · device_private (admin-only) · device_reports (public report)
// RLS decides what comes back: everyone gets published/reserved/sold devices,
// admins get every status plus device_private.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChecklistRow, Condition, Device, DeviceSource, DeviceStatus, DeviceType, InspectionReport, InspectionState, YesNoUnknown } from "@/lib/demo/types";

type DeviceRow = {
  id: string;
  public_code: string;
  title: string;
  type: DeviceType;
  brand: string | null;
  model: string | null;
  details: string | null;
  origin: string | null;
  capacity: string | null;
  manufacture_year: number | null;
  governorate: string | null;
  accessories: string | null;
  condition: Condition;
  inspection_state: InspectionState;
  declared_defects: string | null;
  has_box: boolean | null;
  repaired_before: YesNoUnknown | null;
  sale_price: number;
  compare_at_price: number | null;
  maintenance_months: number;
  source: DeviceSource;
  status: DeviceStatus;
  archive_at: string | null;
  featured: boolean;
  featured_until: string | null;
  views: number;
  published_at: string | null;
  created_at: string;
};
type PrivateRow = {
  device_id: string;
  purchase_cost: number | null;
  seller_net: number | null;
  sale_reason: string | null;
  internal_notes: string | null;
  location_now: string | null;
  submission_id: string | null;
  submission?: { public_code: string } | null;
};
type ChecklistItem = { key?: string; label: string; group?: string; ok: boolean; note?: string | null };
type ReportRow = {
  device_id: string;
  report_code: string | null;
  technician_name: string | null;
  inspected_at: string | null;
  checklist: ChecklistItem[];
  overall_efficiency: string | null;
  appearance: string | null;
  serial_no: string | null;
  replaced_parts: string | null;
  condition: Condition | null;
  defects: string | null;
};

const DEVICE_COLUMNS =
  "id, public_code, title, type, brand, model, details, origin, capacity, manufacture_year, governorate, accessories, condition, inspection_state, declared_defects, has_box, repaired_before, sale_price, compare_at_price, maintenance_months, source, status, archive_at, featured, featured_until, views, published_at, created_at";

/** «12 أكتوبر 2026» */
const dateAr = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" }) : "";

const PUBLIC: DeviceStatus[] = ["published", "reserved", "sold"];
const orPh = (v: string | null | undefined, ph: string) => (v && v.trim() ? v : ph);
const isPh = (v: string | undefined) => !v || v.trim() === "" || v.trim().startsWith("[");
const orNull = (v: string | undefined) => (isPh(v) ? null : (v as string).trim());

function reportFrom(r: ReportRow): InspectionReport {
  return {
    no: orPh(r.report_code, "[###]"),
    date: r.inspected_at ? dateAr(r.inspected_at) : "[التاريخ]",
    serial: orPh(r.serial_no, "[S/N]"),
    technician: orPh(r.technician_name, "[اسم الفني]"),
    efficiency: orPh(r.overall_efficiency, ""),
    appearance: orPh(r.appearance, ""),
    replacedParts: orPh(r.replaced_parts, "[القطع]"),
    checklist: (r.checklist ?? []).map(
      (c): ChecklistRow => ({ label: c.label, result: c.ok ? "pass" : c.note ? "note" : "fail", note: c.note ?? undefined }),
    ),
    defects: (r.defects ?? "").split("\n").map((x) => x.trim()).filter(Boolean),
  };
}

function deviceFrom(d: DeviceRow, p?: PrivateRow, r?: ReportRow): Device {
  return {
    dbId: d.id,
    id: d.public_code,
    title: d.title,
    type: d.type,
    brand: orPh(d.brand, "[الماركة]"),
    model: orPh(d.model, "[الموديل]"),
    year: d.manufacture_year ? String(d.manufacture_year) : "[السنة]",
    origin: orPh(d.origin, "[البلد]"),
    capacity: d.capacity ?? undefined,
    governorate: d.governorate ?? "",
    price: d.sale_price,
    compareAtPrice: d.compare_at_price ?? undefined,
    condition: d.condition,
    inspection: d.inspection_state,
    maintenanceMonths: d.maintenance_months === 6 ? 6 : 3,
    status: d.status,
    archiveAt: d.archive_at ?? undefined,
    // «مميز» ends by itself after BUSINESS.featuredMaxDays.
    featured: d.featured && (!d.featured_until || Date.parse(d.featured_until) > Date.now()),
    featuredUntil: d.featured && d.featured_until ? d.featured_until : undefined,
    views: d.views,
    source: d.source,
    createdAt: dateAr(d.published_at ?? d.created_at),
    accessories: d.accessories ?? "",
    declaredDefects: d.declared_defects ?? "",
    hasBox: d.has_box ?? undefined,
    repairedBefore: d.repaired_before ?? undefined,
    report: r ? reportFrom(r) : undefined,
    purchaseCost: p?.purchase_cost ?? undefined,
    sellerNet: p?.seller_net ?? undefined,
    saleReason: p?.sale_reason ?? undefined,
    internalNotes: p?.internal_notes ?? undefined,
    locationNow: p?.location_now ?? undefined,
    submissionDbId: p?.submission_id ?? undefined,
    submissionId: p?.submission?.public_code ?? undefined,
  };
}

/** All devices this user may see (RLS), newest first, with reports and — for admins — private data. */
export async function fetchDevices(sb: SupabaseClient): Promise<Device[]> {
  const [dv, rp, pv] = await Promise.all([
    sb.from("devices").select(DEVICE_COLUMNS).order("created_at", { ascending: false }),
    sb.from("device_reports").select("device_id, report_code, technician_name, inspected_at, checklist, overall_efficiency, appearance, serial_no, replaced_parts, condition, defects"),
    sb.from("device_private").select("device_id, purchase_cost, seller_net, sale_reason, internal_notes, location_now, submission_id, submission:seller_submissions(public_code)"),
  ]);
  if (dv.error) throw dv.error;
  const reports = new Map((rp.data as ReportRow[] | null ?? []).map((r) => [r.device_id, r]));
  const priv = new Map((pv.data as PrivateRow[] | null ?? []).map((p) => [p.device_id, p]));
  return (dv.data as DeviceRow[]).map((d) => deviceFrom(d, priv.get(d.id), reports.get(d.id)));
}

function rowFrom(d: Device) {
  const year = parseInt(String(d.year).replace(/[^0-9]/g, ""), 10);
  return {
    public_code: d.id,
    title: d.title,
    type: d.type,
    brand: orNull(d.brand),
    model: orNull(d.model),
    origin: orNull(d.origin),
    capacity: orNull(d.capacity),
    manufacture_year: Number.isFinite(year) && year > 1950 ? year : null,
    governorate: d.governorate || null,
    accessories: d.accessories || null,
    condition: d.condition,
    inspection_state: d.inspection,
    declared_defects: d.declaredDefects || null,
    has_box: d.hasBox ?? null,
    repaired_before: d.repairedBefore ?? null,
    sale_price: Math.round(d.price),
    compare_at_price: d.compareAtPrice && d.compareAtPrice > d.price ? Math.round(d.compareAtPrice) : null,
    maintenance_months: d.maintenanceMonths,
    source: d.source,
    status: d.status,
    archive_at: d.status === "sold" ? (d.archiveAt ?? null) : null,
    featured: d.featured,
    featured_until: d.featured ? (d.featuredUntil ?? null) : null,
  };
}

const privateFrom = (d: Device, deviceId: string) => ({
  device_id: deviceId,
  purchase_cost: d.purchaseCost ?? null,
  seller_net: d.sellerNet ?? null,
  sale_reason: d.saleReason ?? null,
  internal_notes: d.internalNotes ?? null,
  location_now: d.locationNow ?? null,
  submission_id: d.submissionDbId ?? null,
});

const reportRowFrom = (r: InspectionReport, deviceId: string, condition: Condition) => ({
  device_id: deviceId,
  report_code: orNull(r.no),
  technician_name: orNull(r.technician),
  inspected_at: new Date().toISOString(),
  checklist: r.checklist.map((c, i) => ({ key: `row${i + 1}`, label: c.label, group: i < 4 ? "core" : "category", ok: c.result === "pass", note: c.note ?? null })),
  overall_efficiency: r.efficiency || null,
  appearance: r.appearance || null,
  serial_no: orNull(r.serial),
  replaced_parts: orNull(r.replacedParts),
  condition,
  defects: r.defects.join("\n") || null,
});

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Write one admin change to the database. `prev` undefined = new device.
 * Returns the database id (new devices get one from the insert).
 */
export async function saveDevice(sb: SupabaseClient, prev: Device | undefined, next: Device): Promise<string> {
  const row = rowFrom(next);
  let id = next.dbId ?? prev?.dbId;
  if (!id) {
    const ins = await sb
      .from("devices")
      .insert({ ...row, published_at: PUBLIC.includes(next.status) ? new Date().toISOString() : null })
      .select("id")
      .single();
    if (ins.error) throw ins.error;
    id = ins.data.id as string;
  } else if (!prev || !same(rowFrom(prev), row)) {
    const becamePublic = PUBLIC.includes(next.status) && (!prev || !PUBLIC.includes(prev.status));
    const upd = await sb
      .from("devices")
      .update(becamePublic ? { ...row, published_at: new Date().toISOString() } : row)
      .eq("id", id);
    if (upd.error) throw upd.error;
  }
  const pNext = privateFrom(next, id);
  if (!prev || !same(privateFrom(prev, id), pNext)) {
    const up = await sb.from("device_private").upsert(pNext);
    if (up.error) throw up.error;
  }
  if (next.report && (!prev || !same(prev.report, next.report))) {
    const up = await sb.from("device_reports").upsert(reportRowFrom(next.report, id, next.condition));
    if (up.error) throw up.error;
  }
  return id;
}

/** Device codes (L-###) the user saved. */
export async function fetchFavorites(sb: SupabaseClient, userId: string): Promise<string[]> {
  const { data } = await sb.from("favorites").select("device:devices!inner(public_code)").eq("user_id", userId);
  return ((data ?? []) as unknown as { device: { public_code: string } }[]).map((f) => f.device.public_code);
}

export async function setFavorite(sb: SupabaseClient, userId: string, deviceDbId: string, on: boolean) {
  const q = on
    ? sb.from("favorites").insert({ user_id: userId, device_id: deviceDbId })
    : sb.from("favorites").delete().eq("user_id", userId).eq("device_id", deviceDbId);
  const { error } = await q;
  if (error && error.code !== "23505") throw error;
}
