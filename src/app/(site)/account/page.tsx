import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PROFILE_COLUMNS, type Profile } from "@/lib/auth/profile";
import { supabaseServer } from "@/lib/supabase/server";
import { AccountTabs, type TabId } from "./AccountTabs";
import { REQUEST_COLUMNS, SUBMISSION_COLUMNS, type MyFavorite, type MyRequest, type MySubmission } from "./data";
import "../_auth/auth.css";

export const metadata: Metadata = { title: "حسابي", robots: { index: false } };

const TABS: TabId[] = ["devices", "requests", "saved", "profile", "orders"];

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const supabase = await supabaseServer();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=/account");

  const [profileRes, subsRes, reqsRes, favRes] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", userId).maybeSingle(),
    supabase.from("seller_submissions").select(SUBMISSION_COLUMNS).eq("seller_id", userId).order("created_at", { ascending: false }),
    supabase.from("device_requests").select(REQUEST_COLUMNS).eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("favorites")
      .select("device_id, created_at, device:public_devices!inner(public_code, title, sale_price, status)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);
  const profile = profileRes.data as Profile | null;
  if (!profile) redirect("/");

  // «طلبات اطلب جهاز» shows how many published devices match each request
  // (type + budget + inspection preference — same rule as the admin page).
  const requests: MyRequest[] = await Promise.all(
    ((reqsRes.data ?? []) as Omit<MyRequest, "matches">[]).map(async (r) => {
      let m = supabase.from("public_devices").select("id", { count: "exact", head: true }).eq("status", "published").eq("type", r.device_type);
      if (r.budget_min) m = m.gte("sale_price", r.budget_min);
      if (r.budget_max) m = m.lte("sale_price", r.budget_max);
      if (r.inspection_pref === "inspected_only") m = m.eq("inspection_state", "inspected");
      const { count } = await m;
      return { ...r, matches: count ?? 0 };
    }),
  );

  type FavRow = { device_id: string; device: Omit<MyFavorite, "device_id"> | null };
  const favorites: MyFavorite[] = ((favRes.data ?? []) as unknown as FavRow[])
    .filter((f) => f.device)
    .map((f) => ({ device_id: f.device_id, ...(f.device as Omit<MyFavorite, "device_id">) }));

  const tab = TABS.includes(q.tab as TabId) ? (q.tab as TabId) : "devices";
  const failed = Boolean(subsRes.error || reqsRes.error || favRes.error);

  return (
    <div className="au-root">
      <AccountTabs
        initialTab={tab}
        profile={profile}
        submissions={(subsRes.data ?? []) as MySubmission[]}
        requests={requests}
        favorites={favorites}
        failed={failed}
      />
    </div>
  );
}
