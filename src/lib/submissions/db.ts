"use client";

// Sell requests ⇄ Supabase (control panel step 2). The admin pages keep the
// `Submission` shape from the demo types; these helpers map it to
// seller_submissions (+ the seller's profiles.trust flag). Admins only — RLS
// returns everything to them.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Condition, DeviceType, LogLine, Submission, SubmissionStatus, YesNoUnknown } from "@/lib/demo/types";

type Row = {
  id: string;
  public_code: string;
  seller_id: string;
  full_name: string;
  phone: string;
  governorate: string;
  pickup_address: string;
  lat: number | null;
  lng: number | null;
  device_type: DeviceType;
  brand: string | null;
  details: string | null;
  accessories: string | null;
  sale_reason: string | null;
  condition: Condition | null;
  wants_repair: boolean;
  repair_description: string | null;
  has_warranty: boolean | null;
  warranty_remaining: string | null;
  has_box: boolean | null;
  repaired_before: YesNoUnknown | null;
  repaired_details: string | null;
  defects: string | null;
  keep_location: "with_seller" | "send_to_platform";
  price_help: boolean;
  sale_price: number | null;
  seller_net: number | null;
  fee_status: Submission["feeStatus"];
  fee_reference: string | null;
  fee_amount: number | null;
  fee_requested_at: string | null;
  first_contact_at: string | null;
  seller_replied_at: string | null;
  status: SubmissionStatus;
  reject_reason: string | null;
  admin_log: { text: string; at: string; tone?: LogLine["tone"] }[];
  device_id: string | null;
  created_at: string;
  seller: { trust: "serious" | "suspicious" | null } | null;
  device: { public_code: string } | null;
  media: { kind: "photo" | "video" | "accessory" }[];
};

const COLUMNS =
  "id, public_code, seller_id, full_name, phone, governorate, pickup_address, lat, lng, device_type, brand, details, accessories, sale_reason, condition, wants_repair, repair_description, has_warranty, warranty_remaining, has_box, repaired_before, repaired_details, defects, keep_location, price_help, sale_price, seller_net, fee_status, fee_reference, fee_amount, fee_requested_at, first_contact_at, seller_replied_at, status, reject_reason, admin_log, device_id, created_at, seller:profiles!seller_submissions_seller_id_fkey(trust), device:devices!seller_submissions_device_id_fkey(public_code), media:submission_media(kind)";

/** «3 نوفمبر، 4:10 م» (Cairo time). */
export function whenAr(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long", timeZone: "Africa/Cairo" });
  const time = d.toLocaleTimeString("ar-EG-u-nu-latn", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Cairo" });
  return `${day}، ${time}`;
}

function fromRow(r: Row): Submission {
  const count = (k: string) => (r.media ?? []).filter((m) => m.kind === k).length;
  return {
    dbId: r.id,
    id: r.public_code,
    createdAt: whenAr(r.created_at),
    createdAtIso: r.created_at,
    sellerId: r.seller_id,
    sellerTrust: r.seller?.trust ?? null,
    fullName: r.full_name,
    phone: r.phone,
    governorate: r.governorate,
    pickupAddress: r.pickup_address,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    deviceType: r.device_type,
    brand: r.brand ?? "",
    details: r.details ?? "",
    year: "",
    accessories: r.accessories ?? "",
    saleReason: r.sale_reason ?? "",
    condition: r.condition ?? "c",
    wantsRepair: r.wants_repair,
    repairDescription: r.repair_description ?? "",
    hasWarranty: !!r.has_warranty,
    warrantyRemaining: r.warranty_remaining ?? "",
    hasBox: !!r.has_box,
    repairedBefore: r.repaired_before ?? "unknown",
    repairedDetails: r.repaired_details ?? "",
    defects: r.defects ?? "",
    keepLocation: r.keep_location,
    priceHelp: r.price_help,
    salePrice: r.sale_price ?? 0,
    sellerNet: r.seller_net ?? 0,
    photos: count("photo"),
    hasVideo: count("video") > 0,
    accessoryPhotos: count("accessory"),
    feeStatus: r.fee_status,
    feeReference: r.fee_reference ?? "",
    feeAmount: r.fee_amount ?? undefined,
    feeRequestedAt: r.fee_requested_at ?? undefined,
    firstContactAt: r.first_contact_at ?? undefined,
    sellerRepliedAt: r.seller_replied_at ?? undefined,
    status: r.status,
    rejectReason: r.reject_reason ?? undefined,
    deviceId: r.device?.public_code ?? undefined,
    log: (r.admin_log ?? []).map((l) => ({ text: l.text, tone: l.tone, iso: l.at, at: l.at ? whenAr(l.at) : "" })),
  };
}

/** Every sell request, newest first (admins). */
export async function fetchSubmissions(sb: SupabaseClient): Promise<Submission[]> {
  const { data, error } = await sb.from("seller_submissions").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(fromRow);
}

/**
 * The columns an admin action can change. `deviceDbId` is the linked listing's
 * uuid (undefined while the new draft device is still being saved).
 */
export function workflowRow(s: Submission, deviceDbId: string | undefined) {
  return {
    status: s.status,
    reject_reason: s.rejectReason ?? null,
    fee_status: s.feeStatus,
    fee_reference: s.feeReference || null,
    fee_amount: s.feeAmount ?? null,
    fee_requested_at: s.feeRequestedAt ?? null,
    first_contact_at: s.firstContactAt ?? null,
    seller_replied_at: s.sellerRepliedAt ?? null,
    device_id: deviceDbId ?? null,
    admin_log: s.log.map((l) => ({ text: l.text, tone: l.tone ?? "info", at: l.iso ?? null })),
  };
}

export async function saveSubmission(sb: SupabaseClient, dbId: string, row: ReturnType<typeof workflowRow>) {
  const { error } = await sb.from("seller_submissions").update(row).eq("id", dbId);
  if (error) throw error;
}

/** Account flag (team only — guarded in the database). */
export async function setTrust(sb: SupabaseClient, userId: string, trust: "serious" | "suspicious" | null) {
  const { error } = await sb.from("profiles").update({ trust }).eq("id", userId);
  if (error) throw error;
}

/** «الرسوم وصلت»: the seller's fee goes into payments as a confirmed seller_fee. */
export async function recordSellerFee(
  sb: SupabaseClient,
  s: Submission,
  amount: number,
  method: string,
  confirmedBy: string,
) {
  const { error } = await sb.from("payments").insert({
    submission_id: s.dbId,
    payer_id: s.sellerId ?? null,
    kind: "seller_fee",
    amount,
    method,
    reference: s.feeReference || null,
    status: "confirmed",
    confirmed_by: confirmedBy,
    confirmed_at: new Date().toISOString(),
  });
  if (error) throw error;
}
