// Row shapes /account reads (RLS returns only the signed-in user's rows).
import type { DeviceType } from "@/lib/demo/types";

export type MySubmission = {
  id: string;
  public_code: string;
  device_type: DeviceType;
  brand: string | null;
  details: string | null;
  sale_price: number | null;
  price_help: boolean;
  status: "new" | "follow_up" | "accepted" | "rejected";
  fee_status: "pending" | "paid" | "refunded" | "forfeited";
  fee_reference: string | null;
  reject_reason: string | null;
  created_at: string;
};

export type MyRequest = {
  id: string;
  public_code: string;
  device_type: DeviceType;
  brand_pref: string | null;
  budget_min: number | null;
  budget_max: number | null;
  needed_by: string | null;
  inspection_pref: "any" | "inspected_only";
  status: "new" | "notified" | "closed";
  created_at: string;
  matches: number;
};

export type MyFavorite = {
  device_id: string;
  public_code: string;
  title: string;
  sale_price: number;
  status: string;
};

export const SUBMISSION_COLUMNS =
  "id, public_code, device_type, brand, details, sale_price, price_help, status, fee_status, fee_reference, reject_reason, created_at";
export const REQUEST_COLUMNS =
  "id, public_code, device_type, brand_pref, budget_min, budget_max, needed_by, inspection_pref, status, created_at";

/** «30 أكتوبر 2026» */
export const dateAr = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" });
