"use client";

// Saves a sell submission to Supabase (table seller_submissions, §7).
// Photos/video aren't uploaded yet — that's Step 5 (R2).
import { salePriceFromSellerNet, sellerNetFromSalePrice } from "@/config/business";
import { parseNum } from "@/lib/demo/labels";
import { supabaseBrowser } from "@/lib/supabase/client";
import { normalizePhone, type SellForm } from "./form";

export type Saved = { id: string; code: string };

export async function saveSubmission(f: SellForm, sellerId: string): Promise<Saved | { error: string; auth?: boolean }> {
  const sale = parseNum(f.sale) || (parseNum(f.net) ? salePriceFromSellerNet(parseNum(f.net)) : 0);
  const row = {
    seller_id: sellerId,
    full_name: f.fullName.trim(),
    phone: normalizePhone(f.phone),
    governorate: f.governorate,
    pickup_address: f.pickupAddress.trim(),
    lat: f.lat ?? null,
    lng: f.lng ?? null,
    device_type: f.deviceType,
    brand: f.brand.trim(),
    details: f.details.trim(),
    accessories: f.accessories.trim(),
    sale_reason: f.saleReason.trim(),
    condition: f.wantsRepair || !f.condition ? null : f.condition,
    wants_repair: f.wantsRepair,
    repair_description: f.wantsRepair ? f.repairDescription.trim() : null,
    has_warranty: f.warranty === "yes",
    warranty_remaining: f.warranty === "yes" ? f.warrantyRemaining.trim() : null,
    has_box: f.box === "yes",
    repaired_before: f.repaired || null,
    repaired_details: f.repaired === "yes" ? f.repairedDetails.trim() : null,
    defects: f.defects.trim(),
    keep_location: f.keepLocation,
    price_help: f.priceHelp && !sale,
    sale_price: sale ? Math.round(sale) : null,
    seller_net: sale ? sellerNetFromSalePrice(sale) : null,
  };
  const { data, error } = await supabaseBrowser().from("seller_submissions").insert(row).select("id, public_code").single();
  if (error || !data) {
    // 401/JWT problems → session ran out while filling the form.
    const auth = error?.code === "PGRST301" || /jwt|auth/i.test(error?.message ?? "");
    return { error: "ما قدرناش نبعت الطلب دلوقتي. بياناتك محفوظة، جرّب تاني بعد شوية.", auth };
  }
  return { id: data.id as string, code: data.public_code as string };
}
