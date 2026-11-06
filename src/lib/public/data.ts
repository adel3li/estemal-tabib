// Public listings, read on the server so pages arrive with them already in
// the HTML (fast first view, WhatsApp / Facebook link previews, Google).
// Visitors' data only — RLS returns published / reserved / sold listings to the
// anon key. Cached for 30 s; the browser store loads the live list right after
// and takes over (signed-in users, admins' drafts, favourites…).
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { fetchDevices } from "@/lib/devices/db";
import { setCategories, type Category } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export type PublicData = { devices: Device[]; categories: Category[] };

const load = unstable_cache(
  async (): Promise<PublicData> => {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const [devices, cats] = await Promise.all([
      fetchDevices(sb, false),
      sb.from("device_categories").select("id, label, sort, active, art, fields").order("sort"),
    ]);
    return { devices, categories: (cats.data ?? []) as Category[] };
  },
  ["public-devices-v1"],
  { revalidate: 30 },
);

/** Listings + categories for visitors, or empty if the database can't be reached (the page then loads them in the browser as before). */
export async function getPublicData(): Promise<PublicData> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { devices: [], categories: [] };
  try {
    const data = await load();
    // Labels (typeLabel, artKey…) are read while rendering on the server too.
    if (data.categories.length) setCategories(data.categories);
    return data;
  } catch (e) {
    console.error("public data load failed", e);
    return { devices: [], categories: [] };
  }
}
