"use client";

// «اطلب جهاز» requests ⇄ Supabase (control panel step 4). Admins only; the
// team changes the status (new → notified → closed).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DeviceRequest, DeviceType } from "@/lib/demo/types";
import { whenAr } from "@/lib/submissions/db";

type Row = {
  id: string;
  public_code: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  governorate: string | null;
  device_type: DeviceType;
  brand_pref: string | null;
  budget_min: number | null;
  budget_max: number | null;
  needed_by: string | null;
  inspection_pref: DeviceRequest["inspectionPref"];
  notes: string | null;
  status: DeviceRequest["status"];
  notified_at: string | null;
  created_at: string;
};

const COLUMNS =
  "id, public_code, user_id, full_name, phone, governorate, device_type, brand_pref, budget_min, budget_max, needed_by, inspection_pref, notes, status, notified_at, created_at";

const day = (iso: string) => whenAr(iso).split("،")[0];

export function requestFromRow(r: Row): DeviceRequest {
  return {
    dbId: r.id,
    userId: r.user_id,
    id: r.public_code,
    createdAt: day(r.created_at),
    createdAtIso: r.created_at,
    fullName: r.full_name ?? "",
    phone: r.phone ?? "",
    governorate: r.governorate ?? "",
    deviceType: r.device_type,
    brandPref: r.brand_pref ?? "",
    budgetMin: r.budget_min ?? 0,
    budgetMax: r.budget_max ?? 0,
    neededBy: r.needed_by ?? "",
    inspectionPref: r.inspection_pref,
    notes: r.notes ?? "",
    status: r.status,
    notifiedAt: r.notified_at ? day(r.notified_at) : undefined,
    notifiedAtIso: r.notified_at ?? undefined,
  };
}

export async function fetchRequests(sb: SupabaseClient): Promise<DeviceRequest[]> {
  const { data, error } = await sb.from("device_requests").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(requestFromRow);
}

/** The columns the team changes. */
export const requestRow = (r: DeviceRequest) => ({ status: r.status, notified_at: r.notifiedAtIso ?? null });

export async function saveRequest(sb: SupabaseClient, dbId: string, row: ReturnType<typeof requestRow>) {
  const { error } = await sb.from("device_requests").update(row).eq("id", dbId);
  if (error) throw error;
}
